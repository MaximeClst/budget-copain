import Colors from "@/constants/Colors";
import { useApp, useMonthData } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Building,
  CreditCard,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { appState } = useApp();
  const [selectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const monthData = useMonthData(selectedMonth);
  const firstName = appState.userConfig?.firstName || "Utilisateur";

  const budgetPercentage = (monthData.totalExpenses / monthData.budget) * 100;

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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Salut {firstName} 👋</Text>
            <Text style={styles.monthSelector}>
              {getMonthName(selectedMonth)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/add-transaction" as any)}
            activeOpacity={0.8}
          >
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetLabel}>Budget mensuel</Text>
            <Text style={styles.budgetAmount}>
              {monthData.budget.toFixed(0)}{" "}
              {appState.userConfig?.currency || "€"}
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
            <Text style={styles.progressText}>
              {budgetPercentage.toFixed(0)}% utilisé
            </Text>
          </View>

          <View style={styles.budgetStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
                <TrendingDown color={Colors.danger} size={20} />
              </View>
              <Text style={styles.statLabel}>Dépenses</Text>
              <Text style={[styles.statValue, { color: Colors.danger }]}>
                {monthData.totalExpenses.toFixed(0)}{" "}
                {appState.userConfig?.currency || "€"}
              </Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#D1FAE5" }]}>
                <TrendingUp color={Colors.success} size={20} />
              </View>
              <Text style={styles.statLabel}>Revenus</Text>
              <Text style={[styles.statValue, { color: Colors.success }]}>
                {monthData.totalIncome.toFixed(0)}{" "}
                {appState.userConfig?.currency || "€"}
              </Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#EEF2FF" }]}>
                <CreditCard color={Colors.primary} size={20} />
              </View>
              <Text style={styles.statLabel}>Restant</Text>
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      monthData.remaining >= 0 ? Colors.primary : Colors.danger,
                  },
                ]}
              >
                {monthData.remaining.toFixed(0)}{" "}
                {appState.userConfig?.currency || "€"}
              </Text>
            </View>
          </View>
        </View>

        {monthData.byCategory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dépenses par catégorie</Text>
            <View style={styles.categoriesContainer}>
              {monthData.byCategory.slice(0, 5).map((item) => (
                <View key={item.category.id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryIcon}>
                        {item.category.icon}
                      </Text>
                      <Text style={styles.categoryName}>
                        {item.category.name}
                      </Text>
                    </View>
                    <Text style={styles.categoryAmount}>
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
                  <Text style={styles.categoryPercentage}>
                    {item.percentage.toFixed(0)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/subscription" as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
              <Building color={Colors.warning} size={24} />
            </View>
            <Text style={styles.actionTitle}>Connexion bancaire</Text>
            <Text style={styles.actionSubtitle}>Synchronise tes comptes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: 60,
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
});
