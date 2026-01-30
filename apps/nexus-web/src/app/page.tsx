"use client";

import {
  contract as identityApiContract,
  models as identityApiModels,
} from "@packages/identity-api-contracts";
import {
  contract as nexusApiContract,
  models as nexusApiModels,
} from "@packages/nexus-api-contracts";
import { callEndpoint } from "@packages/typed-rest";

import { configs } from "@/configs/servers.config";
import Link from "next/link";
import React from "react";
import { Header, Button, Test } from "@packages/spark-ui";

const HomePage = () => {
  return (
    <>
      <div className="w-full h-screen flex flex-col gap-8 justify-center items-center">
        <Header>Nexus Web</Header>
        <Test />
        <div className="flex flex-row gap-4">
          <NexusApiHealthCheckCard />
          <IdentityApiHealthCheckCard />
        </div>
      </div>
    </>
  );
};

const NexusApiHealthCheckCard = () => {
  const [res, setRes] = React.useState<
    nexusApiContract.api.health.GET.response[200] | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleNexusApiHealthCheck = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        nexusApiContract.api.health.GET,
        {},
      );

      // await Promise.resolve(
      //   new Promise((resolve) => setTimeout(resolve, 1000))
      // );

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
      <div className="max-w-md p-6 rounded-2xl flex flex-col gap-4 shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Nexus Api Health Check
        </h1>
        <button
          onClick={handleNexusApiHealthCheck}
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
    </>
  );
};

const IdentityApiHealthCheckCard = () => {
  const [res, setRes] = React.useState<
    identityApiContract.api.health.GET.response[200] | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleIdentityApiHealthCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await callEndpoint(
        configs.identityApiBaseUrl,
        identityApiContract.api.health.GET,
        {},
      );

      // await Promise.resolve(
      //   new Promise((resolve) => setTimeout(resolve, 1000))
      // );

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
      <div className="max-w-md p-6 rounded-2xl flex flex-col gap-4 shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Identity Api Health Check
        </h1>
        <button
          onClick={handleIdentityApiHealthCheck}
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
    </>
  );
};

export default HomePage;
