import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();

  const emojis = [
    { emoji: "🐱", top: 15, left: 12, size: 28, opacity: 0.15 },
    { emoji: "🐾", top: 25, left: 75, size: 24, opacity: 0.12 },
    { emoji: "🎁", top: 35, left: 20, size: 32, opacity: 0.18 },
    { emoji: "😊", top: 45, left: 80, size: 26, opacity: 0.14 },
    { emoji: "🔧", top: 55, left: 15, size: 30, opacity: 0.16 },
    { emoji: "☀️", top: 20, left: 60, size: 28, opacity: 0.15 },
    { emoji: "✂️", top: 65, left: 70, size: 24, opacity: 0.13 },
    { emoji: "⭐", top: 30, left: 40, size: 26, opacity: 0.14 },
    { emoji: "⚡", top: 50, left: 50, size: 30, opacity: 0.17 },
    { emoji: "🎓", top: 70, left: 25, size: 28, opacity: 0.15 },
    { emoji: "🔍", top: 10, left: 45, size: 24, opacity: 0.12 },
    { emoji: "📶", top: 40, left: 85, size: 26, opacity: 0.14 },
    { emoji: "👕", top: 60, left: 35, size: 28, opacity: 0.15 },
    { emoji: "💧", top: 75, left: 55, size: 24, opacity: 0.13 },
    { emoji: "🧪", top: 18, left: 30, size: 30, opacity: 0.16 },
    { emoji: "💡", top: 38, left: 65, size: 28, opacity: 0.15 },
    { emoji: "🎨", top: 58, left: 10, size: 26, opacity: 0.14 },
    { emoji: "🎵", top: 12, left: 80, size: 32, opacity: 0.18 },
    { emoji: "🏠", top: 42, left: 25, size: 28, opacity: 0.15 },
    { emoji: "🚗", top: 62, left: 60, size: 24, opacity: 0.12 },
    { emoji: "🍕", top: 22, left: 50, size: 30, opacity: 0.16 },
    { emoji: "☕", top: 52, left: 18, size: 26, opacity: 0.14 },
    { emoji: "📱", top: 72, left: 45, size: 28, opacity: 0.15 },
    { emoji: "💻", top: 28, left: 70, size: 24, opacity: 0.13 },
    { emoji: "🎮", top: 48, left: 40, size: 30, opacity: 0.17 },
    { emoji: "📚", top: 68, left: 15, size: 26, opacity: 0.14 },
    { emoji: "🎬", top: 16, left: 55, size: 28, opacity: 0.15 },
    { emoji: "🏖️", top: 46, left: 75, size: 24, opacity: 0.12 },
    { emoji: "🌙", top: 66, left: 30, size: 32, opacity: 0.18 },
    { emoji: "🌈", top: 32, left: 8, size: 28, opacity: 0.15 },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.backgroundContainer}>
            {emojis.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.backgroundEmoji,
                  {
                    top: `${item.top}%`,
                    left: `${item.left}%`,
                    fontSize: item.size,
                    opacity: item.opacity,
                  },
                ]}
              >
                {item.emoji}
              </Text>
            ))}
          </View>

          <View style={styles.centerContainer}>
            <Text
              style={styles.buddyText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              BudgetCopain
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/(auth)/auth")}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/(auth)/auth")}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>
                Continue Anonymous 🤑
              </Text>
            </TouchableOpacity>

            <Text style={styles.linkText}>DEJA MEMBRE ?</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B5CF6",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundEmoji: {
    position: "absolute",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    paddingHorizontal: 20,
  },
  buddyText: {
    fontSize: 56,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: -1,
    textAlign: "center",
  },
  bottomSection: {
    gap: 12,
    paddingBottom: 20,
    zIndex: 1,
  },
  primaryButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  linkText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "600" as const,
    letterSpacing: 0.5,
    marginTop: 8,
  },
});
