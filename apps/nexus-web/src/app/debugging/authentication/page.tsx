"use client";

import { LoginForm, SignupFlow } from "@/features/authentication/components";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { Button } from "@packages/spark-ui";
import React from "react";

const AuthenticationDebugPage = () => {
  const { status, token, login, logout, decodedToken } = useAuthContext();

  return (
    <>
      <div className="flex flex-col gap-4 break-all mt-50 max-w-200 p-4 mx-auto">
        <div>AuthenticationDebugPage</div>
        <div>Status: {status}</div>
        <div>Token: {token}</div>
        <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
        {/* <button onClick={login}>Login</button> */}
        <Button onClick={logout}>Logout</Button>
        <div className="border-2 text-white bg-black p-4">
          <div className="text-3xl">LOGIN</div>
          <LoginForm />
        </div>
        <div className="border-2 text-white bg-black p-4">
          <div className="text-3xl">SIGNUP</div>
          <SignupFlow />
        </div>
      </div>
    </>
  );
};

export default AuthenticationDebugPage;
