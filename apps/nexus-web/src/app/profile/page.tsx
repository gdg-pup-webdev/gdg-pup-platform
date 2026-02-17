"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card, Avatar, Badge, Button } from "@/components/ui";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, status, loginWithGoogle } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect to user's portfolio if authenticated
    if (user && user.id) {
      router.push(`/id/${user.id}`);
    }
  }, [user, router]);

  if (status === "checking") {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <PageHeader
          title="Your Profile"
          description="Sign in to view and manage your profile"
        />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <div className="py-12">
              <div className="text-6xl mb-6">🔐</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sign In Required
              </h2>
              <p className="text-gray-600 mb-8">
                Please sign in with your Google account to view and manage your
                profile.
              </p>
              <Button onClick={loginWithGoogle} size="lg">
                Sign In with Google
              </Button>
            </div>
          </Card>

          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              What You'll Get
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Track Progress
                </h4>
                <p className="text-sm text-gray-600">
                  Monitor your achievements and participation
                </p>
              </Card>

              <Card className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-semibold text-gray-900 mb-2">Set Goals</h4>
                <p className="text-sm text-gray-600">
                  Plan your learning journey and milestones
                </p>
              </Card>

              <Card className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h4 className="font-semibold text-gray-900 mb-2">Connect</h4>
                <p className="text-sm text-gray-600">
                  Network with other community members
                </p>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return null;
}
