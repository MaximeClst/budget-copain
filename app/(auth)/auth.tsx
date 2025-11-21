import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const router = useRouter();
  const { updateUserConfig } = useApp();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateUserConfig({
      firstName: "Utilisateur",
      email: "user@example.com",
    });

    setLoading(false);
    router.replace("/(onboarding)/goal");
  };

  const handleAppleAuth = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateUserConfig({
      firstName: "Utilisateur",
      email: "user@example.com",
    });

    setLoading(false);
    router.replace("/(onboarding)/goal");
  };

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenue sur</Text>
            <Text
              style={styles.appName}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              BudgetCopain
            </Text>
            <Text style={styles.subtitle}>Connecte-toi pour commencer</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.authButton, styles.googleButton]}
              onPress={handleGoogleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={Colors.text} />
              ) : (
                <>
                  <Image
                    source={require("@/assets/icons/google-symbol_2875404.png")}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.authButtonText}>
                    Continuer avec Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authButton, styles.appleButton]}
              onPress={handleAppleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Image
                    source={require("@/assets/icons/apple-logo.png")}
                    style={styles.appleIcon}
                  />
                  <Text style={[styles.authButtonText, styles.appleButtonText]}>
                    Continuer avec Apple
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              En continuant, tu acceptes nos conditions générales et notre
              politique de confidentialité
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500" as const,
    marginBottom: 8,
  },
  appName: {
    fontSize: 48,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500" as const,
  },
  buttonContainer: {
    gap: 16,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  authButtonIcon: {
    fontSize: 24,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  appleIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  authButtonText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  appleButtonText: {
    color: "#FFFFFF",
  },
  disclaimer: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
});
