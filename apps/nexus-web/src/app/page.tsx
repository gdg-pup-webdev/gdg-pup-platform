"use client";

import { callEndpoint } from "@packages/api-typing";
import { nexusApiContract, NexusApiTypes } from "@packages/nexus-api-contracts";
import React from "react";

const HomePage = () => {
  const [res, setRes] = React.useState<
    NexusApiTypes["health"]["get"]["response"][200] | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleHealthCheckApi = async () => {
    try {
      setLoading(true);
      const result = await callEndpoint(
        "http://localhost:8000/",
        nexusApiContract.health.get,
        {}
      );

      await Promise.resolve(
        new Promise((resolve) => setTimeout(resolve, 1000))
      );

      if (result.status === 200) {
        setRes(result.body);
        console.log("Health Check Success:", result);
      } else {
        setError(result.body.message);
        console.error("Health Check Failed:", result);
      }
    } catch (err) {
      setError((err as Error).message);
      console.error("Health Check Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="max-w-md p-6 rounded-2xl flex flex-col gap-4 shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-center">Nexus Web</h1>
          <button
            onClick={handleHealthCheckApi}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Check API Health
          </button>

          {loading && !error && <p>Loading...</p>}
          {error && (
            <div className="bg-red-100 p-4 rounded">
              <h2 className="font-semibold">Error:</h2>
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && res && (
            <div className="bg-green-100 p-4 rounded">
              <h2 className="font-semibold">API Response:</h2>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(res, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
