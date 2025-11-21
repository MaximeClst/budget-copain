import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { CategoryId, TransactionType } from "@/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "expense" && styles.typeButtonActiveExpense,
            ]}
            onPress={() => setType("expense")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "expense" && styles.typeButtonTextActive,
              ]}
            >
              Dépense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "income" && styles.typeButtonActiveIncome,
            ]}
            onPress={() => setType("income")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "income" && styles.typeButtonTextActive,
              ]}
            >
              Revenu
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={Colors.border}
            keyboardType="decimal-pad"
            autoFocus
          />
          <Text style={styles.currency}>
            {appState.userConfig?.currency || "€"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégorie</Text>
          <View style={styles.categoriesGrid}>
            {appState.categories
              .filter((c) => c.isActive)
              .map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    categoryId === category.id && {
                      backgroundColor: category.color,
                      borderColor: category.color,
                    },
                  ]}
                  onPress={() => setCategoryId(category.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryChipIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryChipText,
                      categoryId === category.id &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note (optionnel)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Ajouter une note..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={Platform.OS === "ios" ? undefined : 3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!amount || parseFloat(amount) <= 0) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!amount || parseFloat(amount) <= 0}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
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
