import { AuthLayout, VerifyTokenForm } from "@/features/authentication/components";

export default function VerifyPage() {
  return (
    <AuthLayout title="Verify Access Token" subtitle="Ensure your token is valid">
      <VerifyTokenForm />
    </AuthLayout>
  );
}
