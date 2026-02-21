"use client";

import { SignInForm } from "@/features/auth";
import { Stack, Container } from "@packages/spark-ui";

export default function SignInPage() {
  return (
    <Stack
      justify="center"
      align="center"
      className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 px-4"
    >
      <Container padding="none">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Stack gap="xs" align="center" className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </Stack>
          <SignInForm />
        </div>
      </Container>
    </Stack>
  );
}
