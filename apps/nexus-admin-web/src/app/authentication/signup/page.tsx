import { AuthLayout, SignupFlow } from "@/features/authentication/components";

export default function SignupPage() {
  return (
    <AuthLayout title="Create an Account" subtitle="Sign up for a new admin account">
      <SignupFlow />
    </AuthLayout>
  );
}
