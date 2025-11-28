import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  LogOut,
  Shield,
} from "lucide-react-native";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, Pressable } from "@/components/ui";

export default function SettingsScreen() {
  const router = useRouter();
  const { appState, logout } = useApp();
  const userConfig = appState.userConfig;

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Es-tu sûr de vouloir te déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/welcome" as any);
        },
      },
    ]);
  };

  const handleSubscriptionPress = () => {
    router.push({ pathname: "/subscription" } as any);
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "free":
        return "Gratuit";
      case "monthly":
        return "Mensuel";
      case "annual":
        return "Annuel";
      case "lifetime":
        return "Lifetime";
      default:
        return "Gratuit";
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.header}>
          <Text className="text-4xl font-extrabold text-foreground-900">
            Profil
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text className="text-3xl font-bold text-white">
              {userConfig?.firstName?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-foreground-900 mb-1">
            {userConfig?.firstName || "Utilisateur"}
          </Text>
          <Text className="text-base text-foreground-600 mb-3">
            {userConfig?.email || "user@example.com"}
          </Text>
          <View
            style={[
              styles.planBadge,
              {
                backgroundColor:
                  userConfig?.subscriptionPlan === "free"
                    ? Colors.background
                    : "#FFD700" + "20",
              },
            ]}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color:
                  userConfig?.subscriptionPlan === "free"
                    ? Colors.textSecondary
                    : "#B8860B",
              }}
            >
              {getPlanLabel(userConfig?.subscriptionPlan || "free")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text className="text-lg font-bold text-foreground-900 mb-1">
            Abonnement
          </Text>
          <Pressable
            className="flex-row items-center bg-card rounded-2xl p-4 gap-3 shadow-sm"
            onPress={handleSubscriptionPress}
          >
            <View style={[styles.settingIcon, { backgroundColor: "#FEF3C7" }]}>
              <CreditCard color={Colors.warning} size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text className="text-base font-semibold text-foreground-900 mb-0.5">
                Mon abonnement
              </Text>
              <Text className="text-sm text-foreground-600">
                {getPlanLabel(userConfig?.subscriptionPlan || "free")}
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text className="text-lg font-bold text-foreground-900 mb-1">
            Préférences
          </Text>

          <Pressable className="flex-row items-center bg-card rounded-2xl p-4 gap-3 shadow-sm">
            <View style={[styles.settingIcon, { backgroundColor: "#D1FAE5" }]}>
              <DollarSign color={Colors.success} size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text className="text-base font-semibold text-foreground-900 mb-0.5">
                Devise
              </Text>
              <Text className="text-sm text-foreground-600">
                {userConfig?.currency || "€"}
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </Pressable>

          <Pressable className="flex-row items-center bg-card rounded-2xl p-4 gap-3 shadow-sm">
            <View style={[styles.settingIcon, { backgroundColor: "#DBEAFE" }]}>
              <Bell color={Colors.primary} size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text className="text-base font-semibold text-foreground-900 mb-0.5">
                Notifications
              </Text>
              <Text className="text-sm text-foreground-600">
                Gérer les notifications
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text className="text-lg font-bold text-foreground-900 mb-1">
            À propos
          </Text>

          <Pressable className="flex-row items-center bg-card rounded-2xl p-4 gap-3 shadow-sm">
            <View style={[styles.settingIcon, { backgroundColor: "#F3E8FF" }]}>
              <FileText color="#9333EA" size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text className="text-base font-semibold text-foreground-900 mb-0.5">
                Conditions générales
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </Pressable>

          <Pressable className="flex-row items-center bg-card rounded-2xl p-4 gap-3 shadow-sm">
            <View style={[styles.settingIcon, { backgroundColor: "#F3E8FF" }]}>
              <Shield color="#9333EA" size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text className="text-base font-semibold text-foreground-900 mb-0.5">
                Politique de confidentialité
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </Pressable>
        </View>

        <Pressable
          className="flex-row items-center justify-center gap-3 bg-card rounded-2xl p-4 border-2"
          style={{ borderColor: Colors.danger + "30" }}
          onPress={handleLogout}
        >
          <LogOut color={Colors.danger} size={20} />
          <Text className="text-base font-semibold" style={{ color: Colors.danger }}>
            Déconnexion
          </Text>
        </Pressable>

        <Text className="text-sm text-foreground-400 text-center mt-2">
          BudgetCopain v1.0.0
        </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 24,
  },
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  planBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  planBadgeText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  settingCard: {
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
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.danger + "30",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.danger,
  },
  version: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 8,
  },
});
