"use client";

import {
  signInWithGoogle as supabaseSignInWithGoogle,
  supabase,
} from "@/lib/supabase";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

// 1. Define a strictly typed State Object to prevent invalid combos
type AuthState = {
  user: SupabaseUser | null;
  token: string | null;
  role: string | null;
  googleAccessToken: string | null;
  status: "checking" | "unauthenticated" | "authenticated";
  error: string | null;
};

// 2. Define the Context Method types separate from the State
type AuthContextActions = {
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

// Combine them for the final context type
type AuthContextType = AuthState & AuthContextActions;

// Default initial state
const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  googleAccessToken: null,
  status: "checking",
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 3. Use a SINGLE state object for atomic updates
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const getStoredGoogleToken = () => {
    const storedAccessToken = getCookie("googleAccessToken");
    return typeof storedAccessToken === "string" ? storedAccessToken : null;
  };

  const syncSessionToState = (session: Session | null) => {
    if (session) {
      const providerToken = session.provider_token || getStoredGoogleToken();

      if (session.provider_token) {
        setCookie("googleAccessToken", session.provider_token, {
          maxAge: 60 * 60,
          secure: true,
          sameSite: "strict",
        });
      }

      if (session.access_token) {
        setCookie("supabaseAccessToken", session.access_token, {
          maxAge: 60 * 60,
          secure: true,
          sameSite: "strict",
        });
      }

      const role =
        (session.user?.app_metadata?.role as string) ||
        session.user?.role ||
        "guest";

      setAuthState({
        user: session.user,
        token: session.access_token ?? null,
        role,
        googleAccessToken: providerToken,
        status: "authenticated",
        error: null,
      });
    } else {
      deleteCookie("googleAccessToken");
      setAuthState({
        ...initialState,
        status: "unauthenticated",
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    let subscription:
      | ReturnType<
          typeof supabase.auth.onAuthStateChange
        >["data"]["subscription"]
      | null = null;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (isMounted) {
          syncSessionToState(data.session);
        }

        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (!isMounted) return;
            syncSessionToState(session);
          }
        );

        subscription = listener.subscription;
      } catch (err) {
        console.error("Auth State Change Error:", err);
        if (!isMounted) return;
        setAuthState({
          ...initialState,
          status: "unauthenticated",
          error: "Failed to restore authentication state",
        });
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }));
      await supabaseSignInWithGoogle();
    } catch (error: any) {
      console.error(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.message || "Failed to login with Google",
      }));
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      deleteCookie("googleAccessToken");
      // Again, no need to manually set state; the listener will handle it.
    } catch (err: any) {
      setAuthState((prev) => ({
        ...prev,
        error: "Failed to logout",
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
