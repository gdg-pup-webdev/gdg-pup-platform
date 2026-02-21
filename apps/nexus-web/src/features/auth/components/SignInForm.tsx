import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Stack, Text } from "@packages/spark-ui";

export const SignInForm = () => {
  const router = useRouter();
  const { signInWithEmail } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
      // Redirect to home on success
      router.push("/");
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg" className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Text variant="body-sm" className="text-red-700">
            {error}
          </Text>
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <Stack gap="md">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <Text variant="body-sm" className="px-2 bg-white text-gray-500">
              Or continue with
            </Text>
          </div>
        </div>

        <GoogleSignInButton text="Sign in with Google" />
      </Stack>

      <Text variant="body-sm" className="text-center text-gray-600">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Sign up
        </a>
      </Text>
    </Stack>
  );
};
