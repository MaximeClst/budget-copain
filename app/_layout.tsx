import { AppProvider, useApp } from "@/contexts/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { appState, isLoading } = useApp();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();
  const splashHidden = useRef(false);

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
        pathname === "/subscription" || pathname === "/add-transaction";

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
    </Stack>
    </GluestackUIProvider>
  
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
