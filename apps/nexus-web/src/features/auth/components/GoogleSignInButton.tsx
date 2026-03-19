import { useAuthContext } from "@/providers/AuthProvider";
import { useState } from "react";
import { Stack, Inline, Text } from '@packages/spark-ui';

interface GoogleSignInButtonProps {
  text?: string;
  className?: string;
}

export const GoogleSignInButton = ({
  text = "Sign in with Google",
  className = "",
}: GoogleSignInButtonProps) => {
  const { loginWithGoogle } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google sign-in");
      setLoading(false);
    }
  };

  return (
    <Stack gap="xs" className={`w-full ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
          <Text variant="caption" className="text-red-700">{error}</Text>
        </div>
      )}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center bg-gradient-to-b from-[#0f2449] to-[#2a4f91] border border-black text-white py-[12px] text-[18px] rounded-[8px]  font-medium hover:brightness-110 disabled:brightness-50 disabled:cursor-not-allowed transition-all gap-[16px] shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)]"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {loading ? "Connecting..." : text}
      </button>
    </Stack>
  );
};
