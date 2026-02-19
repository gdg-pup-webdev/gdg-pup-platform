"use client";

import { SignUpForm } from "@/features/auth";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sign up to get started
          </p>

          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
