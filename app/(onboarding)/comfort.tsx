import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Comfort = "comfortable" | "balanced" | "tight";

interface ComfortOption {
  id: Comfort;
  icon: string;
  title: string;
  description: string;
}

const comforts: ComfortOption[] = [
  {
    id: "comfortable",
    icon: "😊",
    title: "À l'aise",
    description: "Mes revenus couvrent largement mes dépenses",
  },
  {
    id: "balanced",
    icon: "😐",
    title: "Équilibré",
    description: "Mes fins de mois sont correctes",
  },
  {
    id: "tight",
    icon: "😬",
    title: "Serré",
    description: "J'ai du mal à boucler mes fins de mois",
  },
];

export default function ComfortScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mainGoal: string }>();
  const [selected, setSelected] = useState<Comfort | null>(null);

  const handleNext = () => {
    if (selected) {
      router.push({
        pathname: "/(onboarding)/mode",
        params: {
          mainGoal: params.mainGoal,
          financialComfort: selected,
        },
      });
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
              <View style={styles.progressDot} />
            </View>
            <Text style={styles.stepText}>Étape 2/3</Text>
            <Text style={styles.title}>
              Quelle est ta situation financière ?
            </Text>
            <Text style={styles.subtitle}>
              Pour mieux comprendre tes besoins
            </Text>
          </View>

          <ScrollView
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {comforts.map((comfort) => (
              <TouchableOpacity
                key={comfort.id}
                style={[
                  styles.optionCard,
                  selected === comfort.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(comfort.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{comfort.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{comfort.title}</Text>
                  <Text style={styles.optionDescription}>
                    {comfort.description}
                  </Text>
                </View>
                {selected === comfort.id && (
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
