"use client";

import { useRouter } from "next/navigation";  
import { ProfileCard } from "@/features/profile/components"; 
import { SparkmatesPortfolio } from "@/features/sparkmates";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

export default function ProfilePage() {
  const {token } = useAuthContext();
  const router = useRouter(); 

  const gdgId="testing"

  if (!token) {
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
      <SparkmatesPortfolio gdgId={gdgId} source="direct_link"/>
        {/* <div className="text-sm min-h-screen flex text-center items-center justify-center w-full flex-col">
          <div>logged in with token {token}</div>
          <ProfileCard />
        </div> */}
      </>
    );
}
