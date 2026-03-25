"use client";

import { SparkmatesPortfolio } from "@/features/sparkmates";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

export default function ProfilePage() {
  const { token, decodedToken } = useAuthContext();
  if (!token || !decodedToken) {
    return (
      <>
        <div className="text-[200px] min-h-screen flex text-center items-center justify-center">
          <div>LOGGED IN USER NOT FOUND</div>
        </div>
      </>
    );
  }
  return (
    <>
      <SparkmatesPortfolio
        gdgId={decodedToken?.memberInfo.gdgId}
        source="direct_link"
      />
    </>
  );
}
