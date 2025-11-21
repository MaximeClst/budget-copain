import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";

type Mode = "manual" | "bank" | "mixed";

interface ModeOption {
  id: Mode;
  icon: string;
  title: string;
  description: string;
}

const modes: ModeOption[] = [
  {
    id: "manual",
    icon: "✍️",
    title: "Manuel",
    description: "Je saisirai mes dépenses moi-même",
  },
  {
    id: "bank",
    icon: "🏦",
    title: "Automatique",
    description: "Connexion avec ma banque",
  },
  {
    id: "mixed",
    icon: "🔄",
    title: "Mixte",
    description: "Les deux selon mes besoins",
  },
];

export default function ModeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mainGoal: string;
    financialComfort: string;
  }>();
  const { completeOnboarding } = useApp();
  const [selected, setSelected] = useState<Mode | null>(null);

  const handleFinish = () => {
    if (selected) {
      completeOnboarding({
        mainGoal: params.mainGoal as any,
        financialComfort: params.financialComfort as any,
        usageMode: selected,
      });
      router.replace("/(tabs)");
    }
  };

  return (
    <LinearGradient
      colors={[Colors.background, "#E0E7FF"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={[styles.progressDot, styles.progressDotActive]} />
            </View>
            <Text style={styles.stepText}>Étape 3/3</Text>
            <Text style={styles.title}>
              Comment veux-tu gérer tes finances ?
            </Text>
            <Text style={styles.subtitle}>
              Tu pourras modifier ce choix plus tard
            </Text>
          </View>

          <ScrollView
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {modes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.optionCard,
                  selected === mode.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(mode.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{mode.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{mode.title}</Text>
                  <Text style={styles.optionDescription}>
                    {mode.description}
                  </Text>
                </View>
                {selected === mode.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
            onPress={handleFinish}
            disabled={!selected}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Commencer !</Text>
          </TouchableOpacity>
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
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  stepText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500" as const,
  },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    gap: 12,
    paddingBottom: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#EEF2FF",
  },
  optionIcon: {
    fontSize: 36,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  nextButton: {
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
  nextButtonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});
