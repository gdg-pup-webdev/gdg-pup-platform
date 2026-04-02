"use client";

import { useState } from "react";
import { useVerifyToken } from "../hooks";

export const VerifyTokenForm = () => {
  const { mutateAsync: verifyToken, isPending, error } = useVerifyToken();

  const [token, setToken] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      const res = await verifyToken({ data: { token } });
      if (res?.data) {
        setSuccess(true);
      }
    } catch (err) {}
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error.message}</div>}
      {success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">Token verified successfully!</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Access Token</label>
        <div className="mt-1">
          <input type="text" required value={token} onChange={(e) => setToken(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      
      <button type="submit" disabled={isPending} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400">
        {isPending ? "Verifying..." : "Verify Token"}
      </button>
    </form>
  );
};
