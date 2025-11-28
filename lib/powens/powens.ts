const POWENS_DOMAIN = process.env.EXPO_PUBLIC_POWENS_DOMAIN || "";
const POWENS_CLIENT_ID = process.env.EXPO_PUBLIC_POWENS_CLIENT_ID || "";
const POWENS_CLIENT_SECRET = process.env.EXPO_PUBLIC_POWENS_CLIENT_SECRET || "";

if (!POWENS_DOMAIN || !POWENS_CLIENT_ID || !POWENS_CLIENT_SECRET) {
  console.error(
    "Missing Powens environment variables. Please check your .env file.",
    {
      domain: POWENS_DOMAIN ? "✓" : "✗",
      clientId: POWENS_CLIENT_ID ? "✓" : "✗",
      clientSecret: POWENS_CLIENT_SECRET ? "✓" : "✗",
    }
  );
}

// Le domaine peut être soit juste le nom (ex: "demo"), soit déjà l'URL complète
const getBaseUrl = () => {
  if (!POWENS_DOMAIN) {
    throw new Error("POWENS_DOMAIN is not configured");
  }

  // Si le domaine contient déjà "biapi.pro", on l'utilise tel quel
  if (POWENS_DOMAIN.includes("biapi.pro")) {
    return `https://${POWENS_DOMAIN}/2.0`;
  }

  // Sinon, on construit l'URL avec le format standard
  return `https://${POWENS_DOMAIN}.biapi.pro/2.0`;
};

const BASE_URL = getBaseUrl();

export interface AuthInitResponse {
  auth_token: string;
  user: {
    id: number;
  };
}

export interface TokenCodeResponse {
  code: string;
  expires_in: number;
}

/**
 * Initialise un utilisateur Powens et retourne un token d'accès permanent
 */
export async function initUser(): Promise<AuthInitResponse> {
  const url = `${BASE_URL}/auth/init`;

  console.log("Powens initUser - URL:", url);
  console.log("Powens initUser - Client ID:", POWENS_CLIENT_ID ? "✓" : "✗");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: POWENS_CLIENT_ID,
      client_secret: POWENS_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to initialize Powens user (${response.status}): ${errorText}`;

    // Log détaillé pour le débogage
    console.error("Powens API Error:", {
      url,
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      domain: POWENS_DOMAIN,
    });

    // Message d'erreur plus explicite pour les 404
    if (response.status === 404) {
      errorMessage = `Domaine Powens incorrect ou introuvable. 
      
Le domaine "${POWENS_DOMAIN}" n'existe pas dans Powens.

Pour trouver ton domaine :
1. Connecte-toi à la console Powens (https://console.powens.com)
2. Va dans les paramètres de ton application
3. Le domaine est généralement "demo" pour les tests, ou un nom spécifique fourni par Powens

Configure EXPO_PUBLIC_POWENS_DOMAIN avec le bon domaine (sans .biapi.pro).`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Génère un code temporaire pour la Webview
 */
export async function generateTempCode(
  authToken: string
): Promise<TokenCodeResponse> {
  const response = await fetch(`${BASE_URL}/auth/token/code`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate temp code: ${error}`);
  }

  return response.json();
}

/**
 * Construit l'URL de la Webview Powens
 */
export function buildWebviewUrl(code: string, redirectUri: string): string {
  const params = new URLSearchParams({
    domain: POWENS_DOMAIN,
    client_id: POWENS_CLIENT_ID,
    redirect_uri: redirectUri,
    code: code,
  });

  return `https://webview.powens.com/connect?${params.toString()}`;
}
