import { Pressable, Text } from "@/components/ui";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2, X } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SuccessBankProps {
  title?: string;
  description?: string;
  connectionId?: string;
  onContinue: () => void;
  onClose?: () => void;
}

export default function SuccessBank({
  title = "Connexion réussie !",
  description = "Votre compte bancaire a été connecté avec succès.",
  connectionId,
  onContinue,
  onClose,
}: SuccessBankProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.gradient}
      >
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          {onClose && (
            <View style={styles.header}>
              <Pressable
                onPress={onClose}
                className="justify-center items-center w-10 h-10 rounded-full bg-white/20"
              >
                <X color="#FFFFFF" size={20} />
              </Pressable>
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <CheckCircle2 color={Colors.success} size={64} />
              </View>
            </View>

            <Text className="mb-3 text-3xl font-extrabold text-center text-white">
              {title}
            </Text>

            <Text className="px-6 mb-6 text-base text-center text-white/90">
              {description}
            </Text>

            {connectionId && (
              <View style={styles.infoCard}>
                <Text className="mb-1 text-xs font-semibold text-foreground-600">
                  ID de connexion
                </Text>
                <Text className="font-mono text-sm text-foreground-900">
                  {connectionId}
                </Text>
              </View>
            )}

            <View style={styles.bottomSection}>
              <Pressable
                onPress={onContinue}
                className="justify-center items-center py-4 bg-white rounded-xl"
                style={styles.continueButton}
              >
                <Text className="text-base font-bold text-primary">
                  Continuer
                </Text>
              </Pressable>

              <Text className="px-8 mt-4 text-xs text-center text-white/70">
                Tes transactions seront synchronisées automatiquement
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  bottomSection: {
    width: "100%",
    maxWidth: 400,
    marginTop: "auto",
  },
  continueButton: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
