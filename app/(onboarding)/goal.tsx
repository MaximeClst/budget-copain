import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Goal = "save" | "control" | "invest" | "clear";

interface GoalOption {
  id: Goal;
  icon: string;
  title: string;
  description: string;
}

const goals: GoalOption[] = [
  {
    id: "save",
    icon: "🎯",
    title: "Économiser",
    description: "Mettre de côté pour mes projets",
  },
  {
    id: "control",
    icon: "📊",
    title: "Contrôler",
    description: "Suivre où va mon argent",
  },
  {
    id: "invest",
    icon: "📈",
    title: "Investir",
    description: "Faire fructifier mon argent",
  },
  {
    id: "clear",
    icon: "✨",
    title: "Me libérer",
    description: "Réduire mes dettes",
  },
];

export default function GoalScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Goal | null>(null);

  const handleNext = () => {
    if (selected) {
      router.push({
        pathname: "/(onboarding)/comfort",
        params: { mainGoal: selected },
      });
    }
  };

  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>
            <Text style={styles.stepText}>Étape 1/3</Text>
            <Text style={styles.title}>Quel est ton objectif principal ?</Text>
            <Text style={styles.subtitle}>
              Aide-nous à personnaliser ton expérience
            </Text>
          </View>

          <ScrollView
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.optionCard,
                  selected === goal.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(goal.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{goal.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{goal.title}</Text>
                  <Text style={styles.optionDescription}>
                    {goal.description}
                  </Text>
                </View>
                {selected === goal.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!selected}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: "#9B7EBD",
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
  logoContainer: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logoImage: {
    width: "100%",
    height: "100%",
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressDotActive: {
    backgroundColor: "#FFFFFF",
    width: 24,
  },
  stepText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500" as const,
  },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
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
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
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
    backgroundColor: "#9B7EBD",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  nextButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
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
    color: "#9B7EBD",
  },
});
