"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useLogin } from "../hooks";
import { jwtDecode } from "jwt-decode";

type statusType =
  | "checking"
  | "loggedin"
  | "loggedout"
  | "loggingin"
  | "loggingout";

interface AuthState {
  status: statusType;
  token: string | null;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  error: Error | null;
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
    status: statusType;
    error: Error | null;
  }>({
    status: "checking",
    error: null,
  });
  const { token, setToken, clearToken } = useAuthStore();

  useEffect(() => {
    if (token) {
      setState({ status: "loggedin", error: null });
    } else {
      setState({ status: "loggedout", error: null });
    }
  }, [])

  const login = async (email: string, password: string) => {
    setState({ status: "loggingin", error: null });
    try {
      const res = await loginMutation.mutateAsync({
        email: email,
        pass: password,
      });
      setToken(res.data.token);
      setState({ status: "loggedin", error: null });
    } catch (error) {
      setState({
        status: "loggedout",
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      clearToken();
    }
  };

  const logout = async () => {
    setState({ status: "loggingout", error: null });
    try {
      clearToken();
      setState({ status: "loggedout", error: null });
    } catch (error) {
      setState({
        status: "loggedout",
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
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

type AuthStore = {
  token: string | null;
  decodedToken: any;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      decodedToken: null,
      setToken: (token) => set({ token, decodedToken: jwtDecode(token) }),
      clearToken: () => set({ token: null, decodedToken: null }),
    }),
    {
      name: "nexus-auth-storage",
    },
  ),
);
