"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TokenPayload } from "../types/tokenPayload";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

const decodeJwtPayload = (token: string): TokenPayload | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    const decoded = JSON.parse(atob(padded)) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const STATUS = {
  CHECKING: "checking",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  LOGGINGIN: "loggingin",
  LOGGINGOUT: "loggingout",
} as const;

export type StatusType = (typeof STATUS)[keyof typeof STATUS];

interface AuthState {
  status: StatusType;
  token: string | null;
  decodedToken: TokenPayload | null;
  setAuthToken: (token: string) => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  error: Error | null;
  refreshToken: () => Promise<void>;
  memberProfile: any | null;
  fetchMemberProfile: () => Promise<void>;
  sessionExpiredOnLoad: boolean;
  clearSessionExpiredOnLoad: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export const useAuthContext = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return auth;
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<{
    status: StatusType;
    error: Error | null;
  }>({
    status: "checking",
    error: null,
  });
  const [memberProfile, setMemberProfile] = useState<any | null>(null);
  const {
    token,
    setToken,
    clearToken,
    decodedToken,
    _hasHydrated,
    sessionExpiredOnLoad,
    setSessionExpiredOnLoad,
  } = useTokenStore();

  const refreshToken = async () => {
    // Prevent simultaneous refresh requests (race condition guard)
    const { isRefreshing, setIsRefreshing } = useTokenStore.getState();
    if (isRefreshing) {
      console.debug("Token refresh already in progress, skipping");
      return;
    }
    
    setIsRefreshing(true);
    try {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.refresh.POST,
        {
          body: {
            data: {
              token: token!,
            },
          },
          token: token!,
        },
      );

      if (res.status === 200) {
        setToken(res.body.data);
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("error while refreshing token", error);
      clearToken();
      setState({
        status: STATUS.UNAUTHENTICATED,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!_hasHydrated) return;

    if (token && decodedToken?.validUntil) {
      const validUntilTime = new Date(decodedToken.validUntil).getTime();
      if (Date.now() >= validUntilTime) {
        // Session expired on load
        console.warn("Session expired on load detected");
        setSessionExpiredOnLoad(true);
        clearToken();
        setState({ status: STATUS.UNAUTHENTICATED, error: null });
        return;
      }

      setState({ status: STATUS.AUTHENTICATED, error: null });
    } else {
      setState({ status: STATUS.UNAUTHENTICATED, error: null });
    }
  }, [token, _hasHydrated, decodedToken, clearToken, setSessionExpiredOnLoad]);

  const fetchMemberProfile = async () => {
    if (!token || !decodedToken?.memberInfo.gdgId) return;
    try {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.GET,
        {
          token: token ?? undefined,
          params: { gdgId: decodedToken.memberInfo.gdgId },
        },
      );
      if (res.status === 200) {
        setMemberProfile(res.body.data);
      }
    } catch (error) {
      console.error("Failed to fetch member profile", error);
    }
  };

  useEffect(() => {
    if (state.status === STATUS.AUTHENTICATED && !memberProfile) {
      fetchMemberProfile();
    }
  }, [state.status, token, decodedToken]);

  const login = async (email: string, password: string) => {
    setState({ status: STATUS.LOGGINGIN, error: null });
    try {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.login.POST,
        {
          body: {
            data: {
              email: email,
              password: password,
            },
          },
        },
      );

      if (res.status === 200) {
        setToken(res.body.data.token);
        setState({ status: STATUS.AUTHENTICATED, error: null });
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      setState({
        status: STATUS.UNAUTHENTICATED,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      clearToken();
    }
  };

  const logout = async () => {
    setState({ status: STATUS.LOGGINGOUT, error: null });
    try {
      clearToken();
      setState({ status: STATUS.UNAUTHENTICATED, error: null });

      console.log("logged out");
    } catch (error) {
      setState({
        status: STATUS.UNAUTHENTICATED,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      clearToken();
    }
  };

  const setAuthToken = (nextToken: string) => {
    setToken(nextToken);
    setState({ status: STATUS.AUTHENTICATED, error: null });
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          status: state.status,
          error: state.error,
          token,
          decodedToken,
          setAuthToken,
          login,
          logout,
          refreshToken,
          memberProfile,
          fetchMemberProfile,
          sessionExpiredOnLoad,
          clearSessionExpiredOnLoad: () => setSessionExpiredOnLoad(false),
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

type TokenStore = {
  token: string | null;
  decodedToken: TokenPayload | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  isRefreshing: boolean;
  setIsRefreshing: (state: boolean) => void;
  sessionExpiredOnLoad: boolean;
  setSessionExpiredOnLoad: (state: boolean) => void;
};

const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: null,
      decodedToken: null,
      _hasHydrated: false,
      isRefreshing: false,
      sessionExpiredOnLoad: false,
      setToken: (token: string) =>
        set({ token, decodedToken: decodeJwtPayload(token), sessionExpiredOnLoad: false }),
      clearToken: () => set({ token: null, decodedToken: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setIsRefreshing: (state) => set({ isRefreshing: state }),
      setSessionExpiredOnLoad: (state) => set({ sessionExpiredOnLoad: state }),
    }),
    {
      name: "nexus-auth-storage",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error && state) {
            state.setHasHydrated(true);
          }
        };
      },
    },
  ),
);
