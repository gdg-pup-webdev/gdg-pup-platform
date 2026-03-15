"use client";

import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";

const NEXUS_API_URL =
  process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000";

// Define session type with possible extra fields if needed,
// but extending the official Session is safer.
// For now, let's just use the official Session type directly in our state where possible,
// or intersection if we add custom properties.
// The backend returns a shape that matches Supabase Session, so we can use it.

// Helper type for usage where full session might not be available
type SessionLike = Partial<Session> & {
  access_token: string;
  provider_token?: string | null;
  refresh_token?: string;
  expires_at?: number;
};

// 1. Define a strictly typed State Object to prevent invalid combos
type AuthState = {
  user: User | null;
  token: string | null;
  role: string | null;
  googleAccessToken: string | null;
  status: "checking" | "unauthenticated" | "authenticated";
  error: string | null;
};

// 2. Define the Context Method types separate from the State
type AuthContextActions = {
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
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
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const syncSessionToState = (
    user: User | null,
    session: SessionLike | null,
  ) => {
    if (user && session) {
      const providerToken =
        session.provider_token || (getCookie("googleAccessToken") as string);

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

      const role = user.app_metadata?.role || user.role || "guest";

      setAuthState({
        user,
        token: session.access_token,
        role,
        googleAccessToken: providerToken || null,
        status: "authenticated",
        error: null,
      });
    } else {
      deleteCookie("googleAccessToken");
      deleteCookie("supabaseAccessToken");
      setAuthState({
        ...initialState,
        status: "unauthenticated",
      });
    }
  };

  // Main function to fetch/refresh user session
  const refreshSession = async () => {
    try {
      const token = getCookie("supabaseAccessToken") as string;

      if (!token) {
        setAuthState({
          ...initialState,
          status: "unauthenticated",
        });
        return;
      }

      // Fetch current user from backend
      const response = await fetch(`${NEXUS_API_URL}/api/v1/auth-system/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const result = await response.json();

      if (result.status === "success" && result.data.user) {
        syncSessionToState(result.data.user, {
          access_token: token,
          // If we had the refresh token in memory we'd pass it, but
          // for restoring from cookie, just access_token is critical.
          // The syncSessionToState mainly cares about access_token for state.
        });
      } else {
        throw new Error("Invalid user data");
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
      deleteCookie("supabaseAccessToken");
      deleteCookie("googleAccessToken");
      setAuthState({
        ...initialState,
        status: "unauthenticated",
      });
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true;

    // We wrap refreshSession to respect isMounted, essentially
    // But since check is async, we can just run it.
    // State updates in refreshSession will trigger re-renders.
    refreshSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }));

      const response = await fetch(`${NEXUS_API_URL}/api/v1/auth-system/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { email, password } }),
      });

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        const detail = result.errors?.[0]?.detail;
        const message = detail || result.message || "Failed to sign up";
        throw new Error(message);
      }

      // Store session
      if (result.data.session && result.data.user) {
        syncSessionToState(result.data.user, result.data.session);
      }

      alert(result.message || "Sign up successful!");
    } catch (error: any) {
      console.error(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.message || "Failed to sign up with email",
      }));
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }));

      const response = await fetch(`${NEXUS_API_URL}/api/v1/auth-system/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { email, password } }),
      });

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        const detail = result.errors?.[0]?.detail;
        const message = detail || result.message || "Failed to sign in";
        throw new Error(message);
      }

      // Store session
      if (result.data.session && result.data.user) {
        syncSessionToState(result.data.user, result.data.session);
      }
    } catch (error: any) {
      console.error(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.message || "Failed to sign in with email",
      }));
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, error: null }));

      // Call backend to initiate OAuth
      const response = await fetch(`${NEXUS_API_URL}/api/v1/auth-system/oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            provider: "google",
            redirect_url: `${window.location.origin}/auth/callback`,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        const detail = result.errors?.[0]?.detail;
        const message =
          detail || result.message || "Failed to initiate Google login";
        throw new Error(message);
      }

      // Redirect to OAuth URL
      if (result.data.url) {
        window.location.href = result.data.url;
      }
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
      // 1. Call backend to invalidate session (if we have a token)
      if (authState.token) {
        await fetch(`${NEXUS_API_URL}/api/v1/auth-system/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        });
      }
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      // 2. Always clear client-side state and cookies
      deleteCookie("googleAccessToken");
      deleteCookie("supabaseAccessToken");
      deleteCookie("supabaseRefreshToken");

      setAuthState({
        ...initialState,
        status: "unauthenticated",
      });

      // Optional: Redirect to home or signin
      // window.location.href = "/signin";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
