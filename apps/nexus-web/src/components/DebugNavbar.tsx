import Link from "next/link";
import React from "react";

export const DebugNavbar = () => {
  return (
    <div className="w-full shadow-md bg-white flex flex-row gap-4 p-4 mb-4">
      <Link href="/" className="underline text-blue-500">
        Home Page
      </Link>
      <Link href="/debugging/" className="underline text-blue-500">
        Debug Page
      </Link>
      <Link href="/debugging/auth" className="underline text-blue-500">
        Auth Debugging Page
      </Link>
      <Link href="/testing" className="underline text-blue-500">
        Testing Page
      </Link>
      <Link href="/admin" className="underline text-blue-500">
        Admin Page
      </Link>
    </div>
  );
};
