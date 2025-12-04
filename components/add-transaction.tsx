import { Button, Input, Pressable, Text } from "@/components/ui";
import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { CategoryId, TransactionType } from "@/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTransactionScreen() {
  const router = useRouter();
  const { appState, addTransaction } = useApp();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState<CategoryId>("alimentation");
  const [note, setNote] = useState("");

  const handleSave = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString();

    addTransaction({
      amount: amountNum,
      type,
      categoryId,
      date: dateStr,
      note,
      source: "manual",
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.typeSelector}>
          <Pressable
            className="flex-1 items-center py-4 rounded-2xl border-2 bg-card"
            style={[
              type === "expense"
                ? {
                    backgroundColor: Colors.danger + "10",
                    borderColor: Colors.danger,
                  }
                : { borderColor: Colors.border },
            ]}
            onPress={() => setType("expense")}
          >
            <Text
              className={
                type === "expense"
                  ? "text-base font-bold text-foreground-900"
                  : "text-base font-semibold text-foreground-600"
              }
            >
              Dépense
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 items-center py-4 rounded-2xl border-2 bg-card"
            style={[
              type === "income"
                ? {
                    backgroundColor: Colors.success + "10",
                    borderColor: Colors.success,
                  }
                : { borderColor: Colors.border },
            ]}
            onPress={() => setType("income")}
          >
            <Text
              className={
                type === "income"
                  ? "text-base font-bold text-foreground-900"
                  : "text-base font-semibold text-foreground-600"
              }
            >
              Revenu
            </Text>
          </Pressable>
        </View>

        <View style={styles.amountContainer}>
          <Input
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="decimal-pad"
            autoFocus
            className="text-5xl font-extrabold text-center min-w-[100px] border-0 bg-transparent p-0"
          />
          <Text className="text-3xl font-bold text-foreground-600">
            {appState.userConfig?.currency || "€"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text className="text-lg font-bold text-foreground-900">
            Catégorie
          </Text>
          <View style={styles.categoriesGrid}>
            {appState.categories
              .filter((c) => c.isActive)
              .map((category) => (
                <Pressable
                  key={category.id}
                  className="flex-row gap-2 items-center px-4 py-3 rounded-xl border-2 bg-card"
                  style={[
                    categoryId === category.id && {
                      backgroundColor: category.color,
                      borderColor: category.color,
                    },
                  ]}
                  onPress={() => setCategoryId(category.id)}
                >
                  <Text className="text-xl">{category.icon}</Text>
                  <Text
                    className={
                      categoryId === category.id
                        ? "text-base font-bold text-white"
                        : "text-base font-semibold text-foreground-900"
                    }
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text className="text-lg font-bold text-foreground-900">
            Note (optionnel)
          </Text>
          <Input
            value={note}
            onChangeText={setNote}
            placeholder="Ajouter une note..."
            multiline
            numberOfLines={Platform.OS === "ios" ? undefined : 3}
            textAlignVertical="top"
            className="bg-white"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="solid"
          onPress={handleSave}
          disabled={!amount || parseFloat(amount) <= 0}
          style={styles.saveButton}
        >
          <Text className="text-base font-bold text-white">Enregistrer</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    gap: 32,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  typeButtonActiveExpense: {
    backgroundColor: Colors.danger + "10",
    borderColor: Colors.danger,
  },
  typeButtonActiveIncome: {
    backgroundColor: Colors.success + "10",
    borderColor: Colors.success,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.text,
    fontWeight: "700" as const,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: "800" as const,
    color: Colors.text,
    minWidth: 100,
    textAlign: "center",
  },
  currency: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.textSecondary,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  categoryChipIcon: {
    fontSize: 20,
  },
  categoryChipText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700" as const,
  },
  noteInput: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 0 : 20,
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
  saveButtonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});
