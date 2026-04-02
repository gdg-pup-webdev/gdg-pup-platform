import { AuthLayout, PasswordResetFlow } from "@/features/authentication/components";

export default function PasswordResetPage() {
  return (
    <AuthLayout title="Reset Password" subtitle="Enter your old password to create a new one">
      <PasswordResetFlow />
    </AuthLayout>
  );
}
