import { Button, Text } from "@/components/ui";
import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { getCurrentUser, signInWithGoogle } from "@/lib/supabase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const router = useRouter();
  const { updateUserConfig } = useApp();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      const user = await getCurrentUser();

      if (user) {
        const firstName =
          user.user_metadata?.full_name?.split(" ")[0] ||
          user.user_metadata?.name?.split(" ")[0] ||
          "Utilisateur";

        updateUserConfig({
          firstName,
          email: user.email || "",
        });

        router.replace("/(onboarding)/goal");
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible de se connecter avec Google"
      );
    } finally {
      setLoading(false);
    }
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
            <Text className="text-xl text-white/90 font-medium mb-2">
              Bienvenue sur
            </Text>
            <Text
              className="text-5xl font-extrabold text-white text-center tracking-tight"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              BudgetCopain
            </Text>
            <Text className="text-base text-white/80 font-medium mt-3">
              Connecte-toi pour commencer
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              variant="solid"
              onPress={handleGoogleAuth}
              disabled={loading}
              className="bg-white"
            >
              {loading ? (
                <ActivityIndicator color={Colors.text} />
              ) : (
                <>
                  <Image
                    source={require("@/assets/icons/google-symbol_2875404.png")}
                    style={styles.googleIcon}
                  />
                  <Text className="text-gray-900 font-semibold">
                    Continuer avec Google
                  </Text>
                </>
              )}
            </Button>

            <Button
              variant="solid"
              onPress={handleAppleAuth}
              disabled={loading}
              className="bg-black"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Image
                    source={require("@/assets/icons/apple-logo.png")}
                    style={styles.appleIcon}
                  />
                  <Text className="text-white font-semibold">
                    Continuer avec Apple
                  </Text>
                </>
              )}
            </Button>

            <Text className="text-sm text-white/70 text-center leading-5 mt-2">
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
