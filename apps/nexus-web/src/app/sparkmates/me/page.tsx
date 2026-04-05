"use client";
 
import { useAuthContext } from "@/features/authentication/store/useAuthStore"; 
import { ProfileOwnerView } from "@/features/sparkmates/components/SparkmatesOwnerView/ProfileOwnerView";

export default function ProfilePage() {
  const { token, decodedToken } = useAuthContext();
  if (!token || !decodedToken) {
    return <></>;
  }

  return (
    <>
      <ProfileOwnerView
        gdgId={decodedToken.memberInfo.gdgId}
        source="direct_link"
      />
    </>
  );
}
