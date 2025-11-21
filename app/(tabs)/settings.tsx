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
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userConfig?.firstName?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.profileName}>
            {userConfig?.firstName || "Utilisateur"}
          </Text>
          <Text style={styles.profileEmail}>
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
              style={[
                styles.planBadgeText,
                {
                  color:
                    userConfig?.subscriptionPlan === "free"
                      ? Colors.textSecondary
                      : "#B8860B",
                },
              ]}
            >
              {getPlanLabel(userConfig?.subscriptionPlan || "free")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonnement</Text>
          <TouchableOpacity
            style={styles.settingCard}
            onPress={handleSubscriptionPress}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: "#FEF3C7" }]}>
              <CreditCard color={Colors.warning} size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Mon abonnement</Text>
              <Text style={styles.settingDescription}>
                {getPlanLabel(userConfig?.subscriptionPlan || "free")}
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>

          <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: "#D1FAE5" }]}>
              <DollarSign color={Colors.success} size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Devise</Text>
              <Text style={styles.settingDescription}>
                {userConfig?.currency || "€"}
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: "#DBEAFE" }]}>
              <Bell color={Colors.primary} size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Gérer les notifications
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>

          <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: "#F3E8FF" }]}>
              <FileText color="#9333EA" size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Conditions générales</Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: "#F3E8FF" }]}>
              <Shield color="#9333EA" size={20} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                Politique de confidentialité
              </Text>
            </View>
            <ChevronRight color={Colors.textLight} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut color={Colors.danger} size={20} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={styles.version}>BudgetCopain v1.0.0</Text>
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
