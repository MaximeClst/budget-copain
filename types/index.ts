export type TransactionType = "expense" | "income";

export type CategoryId =
  | "alimentation"
  | "transport"
  | "logement"
  | "loisirs"
  | "sante"
  | "shopping"
  | "voyage"
  | "education"
  | "services"
  | "autres";

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: CategoryId;
  date: string;
  note: string;
  source: "manual" | "bank";
}

export interface MonthlyBudget {
  month: string;
  totalBudget: number;
  totalExpenses: number;
  totalIncome: number;
}

export interface UserConfig {
  firstName: string;
  email: string;
  mainGoal: "save" | "control" | "invest" | "clear";
  financialComfort: "comfortable" | "balanced" | "tight";
  usageMode: "manual" | "bank" | "mixed";
  currency: string;
  firstDayOfWeek: number;
  subscriptionPlan: "free" | "monthly" | "annual" | "lifetime";
  onboardingCompleted: boolean;
}

export interface AppState {
  userConfig: UserConfig | null;
  transactions: Transaction[];
  categories: Category[];
  monthlyBudgets: Record<string, MonthlyBudget>;
}
