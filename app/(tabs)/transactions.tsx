import MoveTransaction from "@/components/Move-Transaction";
import { Pressable, Text } from "@/components/ui";
import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { Transaction } from "@/types";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  const router = useRouter();
  const { appState } = useApp();
  const [selectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);

  const transactions = appState.transactions
    .filter((t) => t.date.startsWith(selectedMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const getCategory = (categoryId: string) => {
    return appState.categories.find((c) => c.id === categoryId);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text className="mb-1 text-4xl font-extrabold text-foreground-900">
                Mouvements
              </Text>
              <Text className="text-sm font-medium text-foreground-600">
                {transactions.length} transactions
              </Text>
            </View>
            <Pressable
              className="justify-center items-center w-12 h-12 rounded-full bg-background-0"
              onPress={() => router.push("/add-transaction" as any)}
            >
              <Plus color={Colors.primary} size={24} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text className="mb-4 text-6xl">📝</Text>
            <Text className="mb-2 text-xl font-bold text-foreground-900">
              Aucune transaction
            </Text>
            <Text className="px-10 text-base text-center text-foreground-600">
              Commence à enregistrer tes dépenses et revenus
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => {
              const category = getCategory(transaction.categoryId);
              return (
                <Pressable
                  key={transaction.id}
                  className="flex-row gap-3 items-center p-4 rounded-2xl shadow-sm bg-card"
                  onPress={() => {
                    setSelectedTransaction(transaction);
                    setIsMoveModalVisible(true);
                  }}
                >
                  <View
                    style={[
                      styles.transactionIcon,
                      { backgroundColor: category?.color + "20" },
                    ]}
                  >
                    <Text className="text-2xl">{category?.icon}</Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text className="text-base font-semibold text-foreground-900 mb-0.5">
                      {category?.name}
                    </Text>
                    <Text className="text-sm text-foreground-600 mb-0.5">
                      {formatDate(transaction.date)}
                    </Text>
                    {transaction.note && (
                      <Text
                        className="text-sm text-foreground-400"
                        numberOfLines={1}
                      >
                        {transaction.note}
                      </Text>
                    )}
                  </View>
                  <Text
                    className="text-lg font-bold"
                    style={{
                      color:
                        transaction.type === "income"
                          ? Colors.success
                          : Colors.danger,
                    }}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount.toFixed(0)}{" "}
                    {appState.userConfig?.currency || "€"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <MoveTransaction
        transaction={selectedTransaction}
        visible={isMoveModalVisible}
        onClose={() => {
          setIsMoveModalVisible(false);
          setSelectedTransaction(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionIconText: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  transactionNote: {
    fontSize: 13,
    color: Colors.textLight,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
});
