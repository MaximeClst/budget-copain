import { Input, Pressable, Text } from "@/components/ui";
import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { CategoryId, Transaction, TransactionType } from "@/types";
import { Trash2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface MoveTransactionProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
}

export default function MoveTransaction({
  transaction,
  visible,
  onClose,
}: MoveTransactionProps) {
  const { appState, updateTransaction, deleteTransaction } = useApp();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState<CategoryId>("alimentation");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategoryId(transaction.categoryId);
      setNote(transaction.note || "");
      // Extraire la date au format YYYY-MM-DD
      const dateObj = new Date(transaction.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      setDate(`${year}-${month}-${day}`);
    }
  }, [transaction]);

  const handleSave = () => {
    if (!transaction) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    const dateStr = date ? new Date(date).toISOString() : transaction.date;

    updateTransaction(transaction.id, {
      amount: amountNum,
      type,
      categoryId,
      date: dateStr,
      note,
    });

    onClose();
  };

  const handleDelete = () => {
    if (!transaction) return;

    Alert.alert(
      "Supprimer la transaction",
      "Es-tu sûr de vouloir supprimer cette transaction ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteTransaction(transaction.id);
            onClose();
          },
        },
      ]
    );
  };

  if (!transaction) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text className="text-xl font-bold text-foreground-900">
              Modifier la transaction
            </Text>
            <Pressable onPress={onClose}>
              <X color={Colors.textSecondary} size={24} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
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
                className="text-4xl font-extrabold text-center min-w-[100px] border-0 bg-transparent p-0"
              />
              <Text className="text-2xl font-bold text-foreground-600">
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
                Date
              </Text>
              <Input
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                className="bg-white"
              />
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
                className="min-h-[100px] bg-white"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable
              style={styles.deleteButton}
              onPress={handleDelete}
              className="justify-center items-center px-6 py-4 rounded-xl border-2"
            >
              <Trash2 color={Colors.danger} size={20} />
              <Text
                className="ml-2 text-base font-bold"
                style={{ color: Colors.danger }}
              >
                Supprimer
              </Text>
            </Pressable>

            <Pressable
              style={styles.saveButton}
              onPress={handleSave}
              className="flex-1 items-center py-4 rounded-xl bg-primary"
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Text className="text-base font-bold text-white">
                Enregistrer
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    width: "90%",
    maxWidth: 500,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 24,
    gap: 24,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  section: {
    gap: 12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.danger,
    backgroundColor: Colors.danger + "10",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
