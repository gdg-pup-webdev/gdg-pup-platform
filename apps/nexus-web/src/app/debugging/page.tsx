"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const page = () => { 

  return (
    <>
      <div className="flex flex-col gap-2 items-start">
        <div> Debugging Page</div> 
        <Link href="/debugging/auth" className="underline text-blue-500">Auth Debugging Page</Link>
        <Link href="/debugging/" className="underline text-blue-500">Debug Page</Link>
        <Link href="/" className="underline text-blue-500">Home Page</Link>
      </div>
    </>
  );
};

export default page;
