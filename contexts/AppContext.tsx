import { defaultCategories } from "@/constants/defaultCategories";
import {
  getCurrentUser,
  getSession,
  signOut as supabaseSignOut,
} from "@/lib/supabase/auth";
import { AppState, Category, Transaction, UserConfig } from "@/types";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "@budgetcopain_data";

const getDefaultUserConfig = (): UserConfig => ({
  firstName: "",
  email: "",
  mainGoal: "save",
  financialComfort: "balanced",
  usageMode: "manual",
  currency: "€",
  firstDayOfWeek: 1,
  subscriptionPlan: "free",
  onboardingCompleted: false,
});

export const [AppProvider, useApp] = createContextHook(() => {
  const [appState, setAppState] = useState<AppState>({
    userConfig: null,
    transactions: [],
    categories: defaultCategories,
    monthlyBudgets: {},
  });

  const sessionQuery = useQuery({
    queryKey: ["supabaseSession"],
    queryFn: async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          const user = await getCurrentUser();
          return user;
        }
        return null;
      } catch (error) {
        console.error("Error checking session:", error);
        return null;
      }
    },
  });

  const dataQuery = useQuery({
    queryKey: ["appData"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AppState;
          return parsed;
        }
        return null;
      } catch (error) {
        console.error("Error loading data:", error);
        return null;
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: AppState) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },
  });

  const { mutate: saveData } = saveMutation;

  const updateUserConfig = useCallback((config: Partial<UserConfig>) => {
    setAppState((prev) => ({
      ...prev,
      userConfig: prev.userConfig
        ? { ...prev.userConfig, ...config }
        : { ...getDefaultUserConfig(), ...config },
    }));
  }, []);

  useEffect(() => {
    if (dataQuery.data) {
      setAppState(dataQuery.data);
    }
  }, [dataQuery.data]);

  // Synchroniser l'utilisateur Supabase avec l'état de l'app
  useEffect(() => {
    if (sessionQuery.data && !appState.userConfig) {
      const user = sessionQuery.data;
      const firstName =
        user.user_metadata?.full_name?.split(" ")[0] ||
        user.user_metadata?.name?.split(" ")[0] ||
        "Utilisateur";

      updateUserConfig({
        firstName,
        email: user.email || "",
      });
    }
    // Si pas de session mais qu'on a un userConfig, on le garde (mode anonyme)
  }, [sessionQuery.data, appState.userConfig, updateUserConfig]);

  useEffect(() => {
    if (appState.userConfig !== null) {
      saveData(appState);
    }
  }, [appState, saveData]);

  const completeOnboarding = useCallback(
    (config: Partial<UserConfig>) => {
      updateUserConfig({ ...config, onboardingCompleted: true });
    },
    [updateUserConfig]
  );

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setAppState((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setAppState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setAppState((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));
    },
    []
  );

  const addCategory = useCallback((category: Omit<Category, "isActive">) => {
    const newCategory: Category = {
      ...category,
      isActive: true,
    };
    setAppState((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  }, []);

  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) => {
      setAppState((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    []
  );

  const setMonthlyBudget = useCallback((month: string, budget: number) => {
    setAppState((prev) => ({
      ...prev,
      monthlyBudgets: {
        ...prev.monthlyBudgets,
        [month]: {
          month,
          totalBudget: budget,
          totalExpenses: prev.monthlyBudgets[month]?.totalExpenses || 0,
          totalIncome: prev.monthlyBudgets[month]?.totalIncome || 0,
        },
      },
    }));
  }, []);

  const logout = useCallback(async () => {
    try {
      // Déconnexion de Supabase si une session existe
      const session = await getSession();
      if (session) {
        await supabaseSignOut();
      }
    } catch (error) {
      console.error("Error signing out from Supabase:", error);
    }

    await AsyncStorage.removeItem(STORAGE_KEY);
    setAppState({
      userConfig: null,
      transactions: [],
      categories: defaultCategories,
      monthlyBudgets: {},
    });
  }, []);

  return useMemo(
    () => ({
      appState,
      isLoading: dataQuery.isLoading || sessionQuery.isLoading,
      updateUserConfig,
      completeOnboarding,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      addCategory,
      updateCategory,
      setMonthlyBudget,
      logout,
    }),
    [
      appState,
      dataQuery.isLoading,
      sessionQuery.isLoading,
      updateUserConfig,
      completeOnboarding,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      addCategory,
      updateCategory,
      setMonthlyBudget,
      logout,
    ]
  );
});

export function useMonthData(month: string) {
  const { appState } = useApp();

  return useMemo(() => {
    const monthTransactions = appState.transactions.filter((t) => {
      const transactionMonth = t.date.substring(0, 7);
      return transactionMonth === month;
    });

    const totalExpenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const budget = appState.monthlyBudgets[month]?.totalBudget || 0;

    const remaining = budget - totalExpenses;

    const byCategory = appState.categories.reduce((acc, category) => {
      const categoryTransactions = monthTransactions.filter(
        (t) => t.categoryId === category.id && t.type === "expense"
      );
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      if (total > 0) {
        acc.push({
          category,
          total,
          percentage: (total / totalExpenses) * 100 || 0,
        });
      }
      return acc;
    }, [] as { category: Category; total: number; percentage: number }[]);

    byCategory.sort((a, b) => b.total - a.total);

    return {
      transactions: monthTransactions,
      totalExpenses,
      totalIncome,
      budget,
      remaining,
      byCategory,
    };
  }, [
    appState.transactions,
    appState.categories,
    appState.monthlyBudgets,
    month,
  ]);
}
