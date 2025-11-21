import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Star, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Plan = "monthly" | "annual" | "lifetime";

interface PlanOption {
  id: Plan;
  name: string;
  price: string;
  pricePerWeek: string;
  popular?: boolean;
  savings?: string;
  trial?: string;
}

const plans: PlanOption[] = [
  {
    id: "monthly",
    name: "1",
    price: "5.99",
    pricePerWeek: "1.49",
  },
  {
    id: "annual",
    name: "12",
    price: "59.99",
    pricePerWeek: "1.43",
    popular: true,
    savings: "SAVE 50%",
    trial: "7 days free",
  },
  {
    id: "lifetime",
    name: "∞",
    price: "99.99",
    pricePerWeek: "1.92",
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { updateUserConfig } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  }, [slideAnim]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 1000,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const handleSelectPlan = () => {
    updateUserConfig({ subscriptionPlan: selectedPlan });
    handleClose();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      />

      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <LinearGradient
          colors={["#8B5CF6", "#6D28D9"]}
          style={styles.topSection}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <View style={styles.closeButtonBg}>
              <X color="#FFFFFF" size={24} />
            </View>
          </TouchableOpacity>

          <Text style={styles.topTitle}>Let&apos;s get started</Text>
          <Text style={styles.mainTitle}>
            How your free{Platform.OS === "web" ? "\n" : " "}trial works
          </Text>

          <View style={styles.ratingContainer}>
            <Star fill="#FCD34D" color="#FCD34D" size={20} />
            <Star fill="#FCD34D" color="#FCD34D" size={20} />
            <Star fill="#FCD34D" color="#FCD34D" size={20} />
            <Star fill="#FCD34D" color="#FCD34D" size={20} />
            <Star fill="#FCD34D" color="#FCD34D" size={20} />
            <Text style={styles.ratingText}>4.8 on App store</Text>
            <Text style={styles.ratingCount}>(21k reviews)</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <View style={styles.infoIcon} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Today</Text>
              <Text style={styles.infoDescription}>
                Get instant access and see how Buddy can improve your financial
                life.
              </Text>
            </View>
          </View>
        </LinearGradient>

        <SafeAreaView style={styles.bottomSection} edges={["bottom"]}>
          <View style={styles.handle} />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.plansContainer}>
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.planCardSelected,
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                  activeOpacity={0.8}
                >
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}

                  <View style={styles.planContent}>
                    <Text
                      style={[
                        styles.planNumber,
                        selectedPlan === plan.id && styles.planNumberSelected,
                      ]}
                    >
                      {plan.name}
                    </Text>
                    <Text
                      style={[
                        styles.planLabel,
                        selectedPlan === plan.id && styles.planLabelSelected,
                      ]}
                    >
                      {plan.id === "lifetime" ? "UNLIMITED" : "MONTHS"}
                    </Text>
                    <Text
                      style={[
                        styles.planPrice,
                        selectedPlan === plan.id && styles.planPriceSelected,
                      ]}
                    >
                      ${plan.price}
                    </Text>
                    <Text
                      style={[
                        styles.planPriceDetail,
                        selectedPlan === plan.id &&
                          styles.planPriceDetailSelected,
                      ]}
                    >
                      ${plan.pricePerWeek}
                      {plan.id === "lifetime" ? "" : " / week"}
                    </Text>
                    {plan.trial && (
                      <Text style={styles.trialText}>{plan.trial}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.disclaimerText}>
              Try 7-days for free, then{" "}
              <Text style={styles.disclaimerBold}>${plans[1].price}/year</Text>.
              {Platform.OS === "web" ? "\n" : " "}
              You can cancel anytime.
            </Text>

            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleSelectPlan}
              activeOpacity={0.8}
            >
              <Text style={styles.subscribeButtonText}>
                TRY FREE & SUBSCRIBE
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "90%",
  },
  topSection: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 24,
    zIndex: 10,
  },
  closeButtonBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "400" as const,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 16,
    lineHeight: 42,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 20,
  },
  bottomSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  scrollContent: {
    padding: 20,
  },
  plansContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    padding: 16,
    alignItems: "center",
    position: "relative",
  },
  planCardSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#6366F1",
  },
  savingsBadge: {
    position: "absolute",
    top: -12,
    backgroundColor: "#6366F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  planContent: {
    alignItems: "center",
  },
  planNumber: {
    fontSize: 52,
    fontWeight: "300" as const,
    color: "#9CA3AF",
    marginBottom: -4,
  },
  planNumberSelected: {
    color: "#1F2937",
  },
  planLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 12,
  },
  planLabelSelected: {
    color: "#6B7280",
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  planPriceSelected: {
    color: "#1F2937",
  },
  planPriceDetail: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500" as const,
  },
  planPriceDetailSelected: {
    color: "#6B7280",
  },
  trialText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6366F1",
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  disclaimerBold: {
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  subscribeButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 20,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});
