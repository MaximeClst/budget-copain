import { useApp } from "@/contexts/AppContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, Pressable } from "@/components/ui";

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
      <Pressable
        style={styles.backdrop}
        onPress={handleClose}
      />

      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <SafeAreaView style={styles.bottomSection} edges={["bottom"]}>
          <View style={styles.handle} />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.plansContainer}>
              {plans.map((plan) => (
                <Pressable
                  key={plan.id}
                  className="flex-1 bg-gray-50 rounded-2xl border-[3px] border-gray-200 p-4 items-center relative pt-6"
                  style={[
                    selectedPlan === plan.id && {
                      backgroundColor: "#FFFFFF",
                      borderColor: "#6366F1",
                    },
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  {plan.savings && (
                    <View className="absolute -top-3 bg-indigo-500 px-3 py-1.5 rounded-xl z-10">
                      <Text className="text-[11px] font-bold text-white tracking-wide">
                        {plan.savings}
                      </Text>
                    </View>
                  )}

                  <View className="items-center pt-2">
                    <Text
                      className={`text-5xl font-light mb-0 ${
                        selectedPlan === plan.id
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {plan.name}
                    </Text>
                    <Text
                      className={`text-xs font-semibold tracking-wider mb-3 ${
                        selectedPlan === plan.id
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {plan.id === "lifetime" ? "UNLIMITED" : "MONTHS"}
                    </Text>
                    <Text
                      className={`text-2xl font-bold mb-0.5 ${
                        selectedPlan === plan.id
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      ${plan.price}
                    </Text>
                    <Text
                      className={`text-sm font-medium ${
                        selectedPlan === plan.id
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      ${plan.pricePerWeek}
                      {plan.id === "lifetime" ? "" : " / week"}
                    </Text>
                    {plan.trial && (
                      <Text className="text-xs font-semibold text-indigo-500 mt-2">
                        {plan.trial}
                      </Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            <Text className="text-base text-gray-600 text-center leading-6 mb-6">
              Try 7-days for free, then{" "}
              <Text className="font-bold text-gray-800">
                ${plans[1].price}/year
              </Text>
              .{Platform.OS === "web" ? "\n" : " "}
              You can cancel anytime.
            </Text>

            <Button
              variant="solid"
              onPress={handleSelectPlan}
              className="bg-gray-800 py-5 rounded-[28px] mb-3"
            >
              <Text className="text-white font-bold text-base tracking-wide">
                TRY FREE & SUBSCRIBE
              </Text>
            </Button>
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
