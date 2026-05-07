import { AuthContextProvider } from "@/features/authentication/store/useAuthStore";
import { QueryProvider } from "@packages/spark-tools/query";
import React from "react";
import { LenisProvider } from "./LenisProvider";
import { SessionManagementWrapper } from "./SessionManagementWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ProviderCompose = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryProvider>
      <LenisProvider>
        <AuthContextProvider>
          <SessionManagementWrapper>
            {children}
            <ToastContainer 
              position="bottom-right" 
              theme="dark"
              closeButton={false}
              hideProgressBar={false}
              autoClose={4000}
            />
          </SessionManagementWrapper>
        </AuthContextProvider>
      </LenisProvider>
    </QueryProvider>
  );
};
