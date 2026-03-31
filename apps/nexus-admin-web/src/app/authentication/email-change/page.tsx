import { AuthLayout, EmailChangeFlow } from "@/features/authentication/components";

export default function EmailChangePage() {
  return (
    <AuthLayout title="Change Email" subtitle="Update your account's email address">
      <EmailChangeFlow />
    </AuthLayout>
  );
}
