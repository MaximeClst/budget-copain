import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  try {
    let redirectUri = AuthSession.makeRedirectUri({
      scheme: "budgetcopain",
    });

    if (redirectUri.startsWith("exp://")) {
      redirectUri = "budgetcopain://";
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: false,
      },
    });

    if (error) throw error;

    if (!data?.url) {
      throw new Error("No URL returned from Supabase");
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type === "success") {
      try {
        const url = new URL(result.url);

        // Avec le flow PKCE, Supabase retourne un code dans l'URL
        // Chercher le code dans les query params
        let code = url.searchParams.get("code");

        // Si pas dans les query params, chercher dans le hash
        if (!code && url.hash) {
          const hashParams = new URLSearchParams(url.hash.substring(1));
          code = hashParams.get("code");
        }

        if (code) {
          // Échanger le code contre une session
          const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (sessionError) {
            console.error("Session exchange error:", sessionError);
            throw sessionError;
          }

          if (sessionData?.session) {
            return sessionData;
          }
        } else {
          let accessToken: string | null = null;
          let refreshToken: string | null = null;

          if (url.hash) {
            const hashParams = new URLSearchParams(url.hash.substring(1));
            accessToken = hashParams.get("access_token");
            refreshToken = hashParams.get("refresh_token");
          }

          // Chercher dans les query params
          if ((!accessToken || !refreshToken) && url.search) {
            accessToken = url.searchParams.get("access_token") || accessToken;
            refreshToken =
              url.searchParams.get("refresh_token") || refreshToken;
          }

          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (sessionError) {
              console.error("Set session error:", sessionError);
              throw sessionError;
            }

            if (sessionData?.session) {
              return sessionData;
            }
          }
        }

        // Fallback: essayer de récupérer la session directement
        // (parfois Supabase la crée automatiquement)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Get session error:", sessionError);
          throw new Error("Failed to get session after authentication");
        }

        if (session) {
          return { session, user: session.user };
        }

        throw new Error("No session found after authentication");
      } catch (urlError: any) {
        console.error("Error parsing callback URL:", urlError);

        // Dernier recours: attendre et vérifier la session
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Final session check error:", sessionError);
          throw new Error(
            `Failed to authenticate: ${urlError.message || urlError}`
          );
        }

        if (session) {
          return { session, user: session.user };
        }

        throw new Error(
          `Failed to parse callback URL: ${urlError.message || urlError}`
        );
      }
    } else if (result.type === "cancel") {
      throw new Error("Authentication cancelled by user");
    } else if (result.type === "dismiss") {
      throw new Error("Authentication dismissed");
    }

    throw new Error(`Authentication failed with type: ${result.type}`);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
