import { AuthContextProvider } from "@/features/authentication/store/useAuthStore";
import { QueryProvider } from "@packages/spark-tools/query";
import React from "react";
import { LenisProvider } from "./LenisProvider";

export const ProviderCompose = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryProvider>
      <LenisProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </LenisProvider>
    </QueryProvider>
  );
};
