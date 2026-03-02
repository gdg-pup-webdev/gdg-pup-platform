"use client";

import { SignUpForm } from "@/features/auth";
import { Stack, Container } from "@packages/spark-ui";

export default function SignUpPage() {
  return (
    <Stack
      justify="center"
      align="center"
      className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 px-4"
    >
      <Container padding="none">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Stack gap="xs" align="center" className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600">Sign up to get started</p>
          </Stack>
          <SignUpForm />
        </div>
      </Container>
    </Stack>
  );
}
