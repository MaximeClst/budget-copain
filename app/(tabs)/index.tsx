import { Input, Pressable, Text } from "@/components/ui";
import Colors from "@/constants/Colors";
import { useApp, useMonthData } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Building,
  CreditCard,
  Edit2,
  Plus,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { appState, setMonthlyBudget } = useApp();
  const [selectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const monthData = useMonthData(selectedMonth);
  const firstName = appState.userConfig?.firstName || "Utilisateur";

  const budgetPercentage =
    monthData.budget > 0
      ? (monthData.totalExpenses / monthData.budget) * 100
      : 0;

  const handleOpenBudgetModal = () => {
    setBudgetInput(monthData.budget.toString());
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = () => {
    const budget = parseFloat(budgetInput);
    if (!isNaN(budget) && budget > 0) {
      setMonthlyBudget(selectedMonth, budget);
      setIsBudgetModalOpen(false);
    }
  };

  const getMonthName = (monthStr: string) => {
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    const [year, month] = monthStr.split("-");
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.header}>
            <View>
              <Text className="mb-1 text-3xl font-extrabold text-white">
                Salut {firstName} 👋
              </Text>
              <Text className="text-base font-medium text-white/90">
                {getMonthName(selectedMonth)}
              </Text>
            </View>
            <Pressable
              className="justify-center items-center w-12 h-12 rounded-full bg-white/20"
              onPress={() => router.push("/add-transaction" as any)}
            >
              <Plus color="#FFFFFF" size={24} />
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View style={styles.budgetHeaderTop}>
              <Text className="mb-2 text-sm font-semibold text-foreground-600">
                Budget mensuel
              </Text>
              <Pressable
                onPress={handleOpenBudgetModal}
                className="justify-center items-center w-8 h-8 rounded-full bg-foreground-100"
              >
                <Edit2 color={Colors.primary} size={16} />
              </Pressable>
            </View>
            <Text className="text-4xl font-extrabold text-foreground-900">
              {monthData.budget > 0
                ? `${monthData.budget.toFixed(0)} ${
                    appState.userConfig?.currency || "€"
                  }`
                : "Non défini"}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(budgetPercentage, 100)}%`,
                    backgroundColor:
                      budgetPercentage > 100
                        ? Colors.danger
                        : budgetPercentage > 80
                        ? Colors.warning
                        : Colors.success,
                  },
                ]}
              />
            </View>
            <Text className="text-sm font-semibold text-foreground-600">
              {budgetPercentage.toFixed(0)}% utilisé
            </Text>
          </View>

          <View style={styles.budgetStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
                <TrendingDown color={Colors.danger} size={20} />
              </View>
              <Text className="text-xs font-semibold text-foreground-600">
                Dépenses
              </Text>
              <Text
                className="text-base font-bold"
                style={{ color: Colors.danger }}
              >
                {monthData.totalExpenses.toFixed(0)}{" "}
                {appState.userConfig?.currency || "€"}
              </Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#D1FAE5" }]}>
                <TrendingUp color={Colors.success} size={20} />
              </View>
              <Text className="text-xs font-semibold text-foreground-600">
                Revenus
              </Text>
              <Text
                className="text-base font-bold"
                style={{ color: Colors.success }}
              >
                {monthData.totalIncome.toFixed(0)}{" "}
                {appState.userConfig?.currency || "€"}
              </Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#EEF2FF" }]}>
                <CreditCard color={Colors.primary} size={20} />
              </View>
              <Text className="text-xs font-semibold text-foreground-600">
                Restant
              </Text>
              <Text
                className="text-base font-bold"
                style={{
                  color:
                    monthData.remaining >= 0 ? Colors.primary : Colors.danger,
                }}
              >
                {monthData.remaining.toFixed(0)}{" "}
                {appState.userConfig?.currency || "€"}
              </Text>
            </View>
          </View>
        </View>

        {monthData.byCategory.length > 0 && (
          <View style={styles.section}>
            <Text className="text-xl font-bold text-foreground-900">
              Dépenses par catégorie
            </Text>
            <View style={styles.categoriesContainer}>
              {monthData.byCategory.slice(0, 5).map((item) => (
                <View key={item.category.id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <Text className="text-2xl">{item.category.icon}</Text>
                      <Text className="text-base font-semibold text-foreground-900">
                        {item.category.name}
                      </Text>
                    </View>
                    <Text className="text-base font-bold text-foreground-900">
                      {item.total.toFixed(0)}{" "}
                      {appState.userConfig?.currency || "€"}
                    </Text>
                  </View>
                  <View style={styles.categoryProgressBar}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: item.category.color,
                        },
                      ]}
                    />
                  </View>
                  <Text className="text-xs font-semibold text-foreground-600">
                    {item.percentage.toFixed(0)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <Pressable
            className="p-5 rounded-2xl shadow-sm bg-card"
            onPress={() => router.push("/bank-connection" as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
              <Building color={Colors.warning} size={24} />
            </View>
            <Text className="mb-1 text-lg font-bold text-foreground-900">
              Connexion bancaire
            </Text>
            <Text className="text-sm text-foreground-600">
              Synchronise tes comptes
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={isBudgetModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsBudgetModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsBudgetModalOpen(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text className="text-xl font-bold text-foreground-900">
                Modifier le budget
              </Text>
              <Pressable onPress={() => setIsBudgetModalOpen(false)}>
                <X color={Colors.textSecondary} size={24} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <Input
                label="Budget mensuel"
                value={budgetInput}
                onChangeText={setBudgetInput}
                keyboardType="numeric"
                placeholder="2000"
                className="mb-4 bg-white"
              />

              <Pressable
                style={styles.saveButton}
                onPress={handleSaveBudget}
                className="items-center py-4 rounded-xl bg-primary"
              >
                <Text className="text-base font-bold text-white">
                  Enregistrer
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  monthSelector: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500" as const,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  budgetCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  budgetHeader: {
    marginBottom: 20,
  },
  budgetHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  budgetAmount: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.background,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600" as const,
  },
  budgetStats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600" as const,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  categoryProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600" as const,
  },
  quickActions: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalBody: {
    gap: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
