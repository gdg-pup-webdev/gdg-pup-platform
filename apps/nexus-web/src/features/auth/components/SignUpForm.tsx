import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Stack, Text } from '@packages/spark-ui';

export const SignUpForm = () => {
  const router = useRouter();
  const { signUpWithEmail } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await signUpWithEmail(email, password);

      // Show success message
      setSuccess(true);
      setLoading(false);

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Stack gap="md" className="text-center py-8">
        <div className="text-green-500 text-6xl">✓</div>
        <Text variant="heading-1" className="text-gray-800">
          Account Created!
        </Text>
        <Text variant="body" className="text-gray-600">
          Please check your email to verify your account.
        </Text>
        <Text variant="body-sm" className="text-gray-500">
          Redirecting to sign in page...
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Text variant="body-sm" className="text-red-700">{error}</Text>
        </div>
      )}

      <form onSubmit={handleSignUp} className="space-y-6">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
            minLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="••••••••"
          />
          <Text variant="caption" className="text-gray-500">
            Must be at least 8 characters
          </Text>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating account..." : "Sign Up"}
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

        <GoogleSignInButton text="Sign up with Google" />
      </Stack>

      <Text variant="body-sm" className="text-center text-gray-600">
        Already have an account?{" "}
        <a
          href="/signin"
          className="text-purple-600 hover:text-purple-700 font-semibold"
        >
          Sign in
        </a>
      </Text>
    </Stack>
  );
};
