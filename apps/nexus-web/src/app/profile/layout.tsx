"use client";
 
import { AuthGuard } from "@/features/authentication/components";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();

  // const isSubRoute = pathname !== "/profile";

  // if (!isSubRoute) {
  //   return <>{children}</>;
  // }

  return <AuthGuard>{children}</AuthGuard>;
}
