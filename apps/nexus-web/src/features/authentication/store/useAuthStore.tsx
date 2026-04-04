"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useLogin } from "../hooks";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "../types/tokenPayload";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

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
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  error: Error | null;
  refreshToken: () => Promise<void>;
  memberProfile: any | null;
  fetchMemberProfile: () => Promise<void>;
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
  const loginMutation = useLogin();
  const [state, setState] = useState<{
    status: StatusType;
    error: Error | null;
  }>({
    status: "checking",
    error: null,
  });
  const [memberProfile, setMemberProfile] = useState<any | null>(null);
  const { token, setToken, clearToken, decodedToken, _hasHydrated } =
    useTokenStore();

  // console.log("AuthContextProvider rendered with status:", state.status);

  const refreshTokenMutation = useRefreshToken();

  const refreshToken = async () => {
    try {
      const res = await refreshTokenMutation.mutateAsync({ token: token! });
      setToken(res.data);
    } catch (error) {
      console.error("error while refreshing token", error);
      clearToken();
      setState({
        status: STATUS.UNAUTHENTICATED,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  };

  useEffect(() => {
    if (!token || !decodedToken) return;
    const REFRESH_INTERVAL = 40 * 60 * 1000;
    const timer = setTimeout(() => {
      refreshToken();
    }, REFRESH_INTERVAL);

    return () => clearTimeout(timer);
  }, [token, decodedToken]);

  useEffect(() => { 
    if (!_hasHydrated) return;
    if (token) {
      setState({ status: STATUS.AUTHENTICATED, error: null });
    } else {
      setState({ status: STATUS.UNAUTHENTICATED, error: null });
      setMemberProfile(null);
    }
  }, [token, _hasHydrated]);

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
      const res = await loginMutation.mutateAsync({
        email: email,
        pass: password,
      });
      setToken(res.data.token);
      setState({ status: STATUS.AUTHENTICATED, error: null });
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

  return (
    <>
      <AuthContext.Provider
        value={{
          status: state.status,
          error: state.error,
          token,
          decodedToken,
          login,
          logout,
          refreshToken,
          memberProfile,
          fetchMemberProfile,
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
  _hasHydrated: boolean; // Add this
  setHasHydrated: (state: boolean) => void; // Add this
};

const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: null,
      decodedToken: null,
      _hasHydrated: false,
      setToken: (token: string) =>
        set({ token, decodedToken: jwtDecode(token) }),
      clearToken: () => set({ token: null, decodedToken: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
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
