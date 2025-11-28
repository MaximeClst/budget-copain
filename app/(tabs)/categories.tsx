import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, Pressable } from "@/components/ui";

export default function CategoriesScreen() {
  const { appState } = useApp();
  const activeCategories = appState.categories.filter((c) => c.isActive);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text className="text-4xl font-extrabold text-foreground-900 mb-1">
                Catégories
              </Text>
              <Text className="text-sm text-foreground-600 font-medium">
                {activeCategories.length} catégories actives
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesGrid}>
          {activeCategories.map((category) => (
            <Pressable
              key={category.id}
              className="w-[48%] bg-card rounded-2xl p-5 items-center gap-3 border-2 shadow-sm"
              style={{ borderColor: category.color }}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: category.color + "20" },
                ]}
              >
                <Text className="text-3xl">{category.icon}</Text>
              </View>
              <Text className="text-base font-semibold text-foreground-900 text-center">
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {appState.userConfig?.subscriptionPlan === "free" && (
          <View style={styles.limitBanner}>
            <Text className="text-base font-semibold text-foreground-900 text-center">
              🎁 Version gratuite : {activeCategories.length}/10 catégories
            </Text>
            <Text className="text-sm text-foreground-600 text-center">
              Passe en premium pour des catégories illimitées
            </Text>
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    textAlign: "center",
  },
  limitBanner: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  limitText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    textAlign: "center",
  },
  limitSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
