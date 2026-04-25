import { AuthContextProvider } from "@/features/authentication/store/useAuthStore";
import { QueryProvider } from "@packages/spark-tools/query";
import React from "react";
import { LenisProvider } from "./LenisProvider";
import { SessionManagementWrapper } from "./SessionManagementWrapper";

export const ProviderCompose = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryProvider>
      <LenisProvider>
        <AuthContextProvider>
          <SessionManagementWrapper>{children}</SessionManagementWrapper>
        </AuthContextProvider>
      </LenisProvider>
    </QueryProvider>
  );
};
