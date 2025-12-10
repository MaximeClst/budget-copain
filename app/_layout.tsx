import { AppProvider, useApp } from "@/contexts/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import StripeProvider from "@/components/stripe-provider";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import * as Linking from "expo-linking";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { appState, isLoading } = useApp();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();
  const splashHidden = useRef(false);

  // Gérer les deep links Powens au niveau root
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      console.log("Deep link root:", url);
      const parsed = Linking.parse(url);
      const { connection_id, error: errorParam } = parsed.queryParams || {};

      // Si on a un connection_id ou une erreur et qu'on n'est pas déjà sur bank-connection
      if ((connection_id || errorParam) && pathname !== "/bank-connection") {
        // Rediriger vers bank-connection avec les paramètres
        const params = new URLSearchParams();
        if (connection_id) params.set("connection_id", String(connection_id));
        if (errorParam) params.set("error", String(errorParam));
        router.push(`/bank-connection?${params.toString()}`);
      }
    };

    // Écouter les deep links
    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (url.startsWith("budgetcopain://")) {
        handleDeepLink(url);
      }
    });

    // Vérifier si l'app a été ouverte via un deep link
    Linking.getInitialURL().then((url) => {
      if (url && url.startsWith("budgetcopain://")) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router, pathname]);

  // Hide splash screen once when app is ready
  useEffect(() => {
    if (!isLoading && !splashHidden.current) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore errors if splash screen is already hidden
      });
      splashHidden.current = true;
    }
  }, [isLoading]);

  // Handle navigation logic
  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === "(auth)";
      const inOnboardingGroup = segments[0] === "(onboarding)";
      const inTabsGroup = segments[0] === "(tabs)";
      // Routes modales qui ne doivent pas déclencher de redirection
      const isModalRoute =
        pathname === "/subscription" ||
        pathname === "/add-transaction" ||
        pathname === "/bank-connection";

      if (!appState.userConfig) {
        if (!inAuthGroup) {
          router.replace("/(auth)/welcome");
        }
      } else if (!appState.userConfig.onboardingCompleted) {
        if (!inOnboardingGroup) {
          router.replace("/(onboarding)/goal");
        }
      } else {
        if (!inTabsGroup && !isModalRoute) {
          router.replace("/(tabs)");
        }
      }
    }
  }, [appState, isLoading, segments, pathname, router]);

  return (
    <StripeProvider>
      <GluestackUIProvider mode="dark">
        <Stack screenOptions={{ headerBackTitle: "Retour" }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-transaction"
            options={{
              presentation: "modal",
              headerTitle: "Nouvelle transaction",
            }}
          />
          <Stack.Screen
            name="subscription"
            options={{
              presentation: "transparentModal",
              headerShown: false,
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="bank-connection"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
        </Stack>
      </GluestackUIProvider>
    </StripeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </AppProvider>
    </QueryClientProvider>
  );
}
