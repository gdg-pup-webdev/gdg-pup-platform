"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const page = () => {
  const authContext = useAuthContext();
  console.log(authContext);

  const handleListClasses = async () => {
    const response = await fetch(
      "https://classroom.googleapis.com/v1/courses",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authContext.googleAccessToken}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };
  


  const handleCopyToken = () => {
    if (authContext.token) {
      navigator.clipboard.writeText(authContext.token);
      toast.success("Token copied to clipboard");
    } else {
      toast.error("No token to copy");
    }
  };

  const handleCopyGoogleAccessToken = () => {
    if (authContext.googleAccessToken) {
      navigator.clipboard.writeText(authContext.googleAccessToken);
      toast.success("Google Access Token copied to clipboard");
    } else {
      toast.error("No Google Access Token to copy");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 items-start">
        <div>Authentication Debugging Page</div>
        <Link href="/debugging/" className="underline text-blue-500">Debug Page</Link>
        <button
          className="p-2 border rounded-2xl bg-greenn-200"
          onClick={authContext.loginWithGoogle}
        >
          login with google{" "}
        </button>
        <button
          className="p-2 border rounded-2xl bg-red-200"
          onClick={authContext.logout}
        >
          logout
        </button>
        <button
          className="p-2 border rounded-2xl bg-blue-200"
          onClick={handleCopyToken}
        >
          Copy Token to Clipboard
        </button>
        <button
          className="p-2 border rounded-2xl bg-blue-200"
          onClick={handleCopyGoogleAccessToken}
        >
          Copy Google Access Token to Clipboard
        </button>
        <button
          onClick={handleListClasses}
          className="p-2 border rounded-2xl bg-red-200"
        >
          List Google Classroom Classes
        </button>
        <div>Auth Context State:</div>
        <pre>{JSON.stringify(authContext, null, 2)}</pre>
      </div>
    </>
  );
};

export default page;
