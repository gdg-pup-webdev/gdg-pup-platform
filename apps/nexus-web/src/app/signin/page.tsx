"use client";

import { SignInForm } from "@/features/auth";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 px-4">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your account
          </p>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}
