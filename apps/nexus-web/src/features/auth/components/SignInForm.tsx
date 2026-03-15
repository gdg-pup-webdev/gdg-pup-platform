import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Stack, Text, Input } from '@packages/spark-ui';

const ICON_URL = "https://www.figma.com/api/mcp/asset/7a525ea7-ee44-4ac7-97cc-7d9a5fc0cd62";

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
      router.push("/");
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg" className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Text variant="body-sm" className="text-red-700">{error}</Text>
        </div>
      )}

      <form onSubmit={handleSignIn} className="flex flex-col gap-[24px]">

        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="email"
            className="text-[18px] font-bold text-white "
          >
            Email
          </label>
          <div className="relative group w-full rounded-[8px] p-[1px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] transition-all duration-300">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              containerClassName="!h-auto !py-[16px] !px-[16px] !border-none !rounded-[7px] !ring-0 focus-within:!ring-0 w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]"
              className="text-[18px] text-white placeholder:text-[#737373]"
              leftIcon={<img src={ICON_URL} alt="" className="w-[24px] h-[24px]" />}
              placeholder="e.g., sparkylorenzo@gmail.com"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="password"
            className="flex justify-between items-center text-[18px] font-bold text-white "
          >
            Password
          </label>
          <div className="relative group w-full rounded-[8px] p-[1px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] transition-all duration-300">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              containerClassName="!h-auto !py-[16px] !px-[16px] !border-none !rounded-[7px] !ring-0 focus-within:!ring-0 w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]"
              className="text-[18px] text-white placeholder:text-[#737373]"
              leftIcon={<img src={ICON_URL} alt="" className="w-[24px] h-[24px]" />}
              placeholder="Enter Your Password"
            />
          </div>
          <div className="flex justify-end">
            <a href="/forgot-password" className="text-white text-[16px] font-medium  hover:underline">Forgot Password?</a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-t from-[#2b7fff] to-[#162456] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)] text-white text-[18px] font-medium py-[12px] px-[16px] gap-[16px] rounded-[8px] hover:brightness-110 disabled:opacity-70 transition-all "
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-[8px] w-full mt-4">
        <div className="flex-1 h-[1px] bg-white/20"></div>
        <p className="text-[#e5e5e5] text-[16px] font-regular  px-2">or continue with</p>
        <div className="flex-1 h-[1px] bg-white/20"></div>
      </div>

      <GoogleSignInButton text="Sign in with Google" />

      <div className="flex justify-center mt-6 items-center gap-[8px]">
        <span className="text-white/80 text-[16px] font-medium ">Don't have an account yet?</span>
        <a href="/signup" className="text-white font-bold hover:underline ">Sign Up</a>
      </div>
    </Stack>
  );
};
