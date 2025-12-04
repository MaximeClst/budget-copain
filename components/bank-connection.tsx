import { Pressable, Text } from "@/components/ui";
import Colors from "@/constants/Colors";
import {
  buildWebviewUrl,
  generateTempCode,
  initUser,
} from "@/lib/powens/powens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Building, X } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AUTH_TOKEN_KEY = "@powens_auth_token";
// Utiliser le redirect_uri spécifique pour cette page (configuré dans Powens)
const REDIRECT_URI = "budgetcopain://bank-connection";

export default function BankConnectionScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webBrowserRef = useRef<WebBrowser.WebBrowserAuthSessionResult | null>(
    null
  );

  const handleDeepLink = useCallback(
    ({ url }: { url: string }) => {
      console.log("Deep link reçu:", url);

      const parsed = Linking.parse(url);
      const { connection_id, error: errorParam } = parsed.queryParams || {};

      // Fermer la Webview si elle est encore ouverte (seulement après avoir traité le résultat)
      WebBrowser.maybeCompleteAuthSession();
      setLoading(false);

      if (errorParam) {
        Alert.alert(
          "Erreur de connexion",
          typeof errorParam === "string"
            ? errorParam
            : "Une erreur est survenue"
        );
        router.back();
        return;
      }

      if (connection_id) {
        Alert.alert(
          "Connexion réussie !",
          `Votre compte bancaire a été connecté avec succès. Connection ID: ${connection_id}`,
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    },
    [router]
  );

  // Gérer le deep link depuis les query params (quand l'app revient au premier plan)
  useEffect(() => {
    const connectionId = searchParams.connection_id;
    const errorParam = searchParams.error;

    if (connectionId || errorParam) {
      const connectionIdStr = Array.isArray(connectionId)
        ? connectionId[0]
        : connectionId;
      const errorParamStr = Array.isArray(errorParam)
        ? errorParam[0]
        : errorParam;

      console.log("Connection ID depuis query params:", connectionIdStr);
      setLoading(false);
      WebBrowser.maybeCompleteAuthSession();

      if (errorParamStr) {
        Alert.alert(
          "Erreur de connexion",
          typeof errorParamStr === "string"
            ? errorParamStr
            : "Une erreur est survenue"
        );
        router.back();
        return;
      }

      if (connectionIdStr) {
        Alert.alert(
          "Connexion réussie !",
          `Votre compte bancaire a été connecté avec succès. Connection ID: ${connectionIdStr}`,
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Écouter les deep links pour gérer le retour de la Webview
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Vérifier si l'app a été ouverte via un deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL:", url);
        handleDeepLink({ url });
      }
    });

    // Écouter les changements d'état de l'app (quand elle revient au premier plan)
    const subscriptionAppState = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          // Vérifier à nouveau le deep link quand l'app revient au premier plan
          Linking.getInitialURL().then((url) => {
            if (url && url.includes("connection_id")) {
              console.log("App revenue au premier plan avec URL:", url);
              handleDeepLink({ url });
            }
          });
        }
      }
    );

    return () => {
      subscription.remove();
      subscriptionAppState.remove();
    };
  }, [handleDeepLink]);

  const handleConnectBank = async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer ou créer un token d'accès
      let authToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

      if (!authToken) {
        const initResponse = await initUser();
        authToken = initResponse.auth_token;
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken);
      }

      // Générer un code temporaire
      const codeResponse = await generateTempCode(authToken);

      // Construire l'URL de la Webview
      const webviewUrl = buildWebviewUrl(codeResponse.code, REDIRECT_URI);

      console.log("Ouverture de la Webview:", webviewUrl);
      console.log("Redirect URI:", REDIRECT_URI);

      // Utiliser openBrowserAsync pour permettre les redirections vers les sites bancaires
      // openAuthSessionAsync peut bloquer les redirections vers des domaines externes
      const result = await WebBrowser.openBrowserAsync(webviewUrl, {
        showTitle: true,
        toolbarColor: Colors.primary,
        enableBarCollapsing: false,
        // Ne pas créer de nouvelle tâche pour permettre les redirections multiples
        createTask: false,
      });

      webBrowserRef.current = result;
      console.log("Résultat WebBrowser:", result.type, result);

      // Si l'utilisateur ferme le navigateur sans compléter, on arrête le loading
      if (result.type === "cancel" || result.type === "dismiss") {
        console.log("Webview fermée par l'utilisateur");
        setLoading(false);
      } else if (result.type === "opened") {
        // Le navigateur s'est ouvert et on attend le deep link
        // Le deep link sera géré par handleDeepLink quand Powens redirigera
        console.log("Webview ouverte, en attente du deep link...");
        // Le loading reste actif jusqu'à ce que le deep link soit reçu
      }
    } catch (err) {
      console.error("Error connecting bank:", err);

      let errorMessage = "Une erreur est survenue";
      if (err instanceof Error) {
        errorMessage = err.message;

        // Messages d'erreur plus clairs
        if (errorMessage.includes("Domaine Powens incorrect")) {
          // Garde le message détaillé de l'erreur
        } else if (
          errorMessage.includes("notFound") ||
          errorMessage.includes("404")
        ) {
          errorMessage =
            "Domaine Powens incorrect. Vérifie EXPO_PUBLIC_POWENS_DOMAIN dans ton .env. Le domaine doit être celui fourni par Powens (généralement 'demo' pour les tests).";
        } else if (errorMessage.includes("Missing")) {
          errorMessage =
            "Variables d'environnement Powens manquantes. Vérifie ton fichier .env";
        }
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <X color={Colors.text} size={20} />
          </Pressable>
          <Text className="text-xl font-bold text-foreground-900">
            Connexion bancaire
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: "#FEF3C7" }]}>
            <Building color={Colors.warning} size={48} />
          </View>
        </View>

        <Text className="text-2xl font-bold text-foreground-900 text-center mb-3">
          Connecte ta banque
        </Text>
        <Text className="text-base text-foreground-600 text-center mb-8 px-6">
          Synchronise tes comptes bancaires pour suivre automatiquement tes
          dépenses et revenus
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}

        <Pressable
          onPress={handleConnectBank}
          disabled={loading}
          className="bg-primary rounded-2xl p-5 items-center justify-center"
          style={[loading && styles.buttonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primaryDark} />
          ) : (
            <Text className="text-primaryDark font-bold text-base">
              Commencer la connexion
            </Text>
          )}
        </Pressable>

        <Text className="text-xs text-foreground-500 text-center mt-6 px-8">
          En continuant, tu acceptes que tes données bancaires soient traitées
          de manière sécurisée par Powens
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
