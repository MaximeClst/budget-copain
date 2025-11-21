import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { AppState, Transaction, Category, UserConfig } from "@/types";
import { defaultCategories } from "@/constants/defaultCategories";

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

  useEffect(() => {
    if (dataQuery.data) {
      setAppState(dataQuery.data);
    }
  }, [dataQuery.data]);

  useEffect(() => {
    if (appState.userConfig !== null) {
      saveData(appState);
    }
  }, [appState, saveData]);

  const updateUserConfig = useCallback((config: Partial<UserConfig>) => {
    setAppState((prev) => ({
      ...prev,
      userConfig: prev.userConfig
        ? { ...prev.userConfig, ...config }
        : { ...getDefaultUserConfig(), ...config },
    }));
  }, []);

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
      isLoading: dataQuery.isLoading,
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

    const budget = appState.monthlyBudgets[month]?.totalBudget || 2000;

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
