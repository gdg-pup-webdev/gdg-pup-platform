import { AuthLayout, LoginForm } from "@/features/authentication/components";

export default function LoginPage() {
  return (
    <AuthLayout title="Admin Login" subtitle="Sign in to your account">
      <LoginForm />
    </AuthLayout>
  );
}
