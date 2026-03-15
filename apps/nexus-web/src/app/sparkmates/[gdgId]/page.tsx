"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { configs } from "@/configs/servers.config";
import { useAuthContext } from "@/providers/AuthProvider";

type SparkmatesStatus = "issued" | "activated" | "suspended" | "revoked";
type SparkmatesSource = "nfc_card" | "qr_code" | "direct_link";

type SparkmatesPortfolio = {
  full_name: string | null;
  nickname: string | null;
  gdg_id: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_website_url: string | null;
};

type SparkmatesResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    gdg_id: string;
    source: SparkmatesSource;
    status: SparkmatesStatus;
    portfolio: SparkmatesPortfolio | null;
  };
};

function normalizeSource(raw: string | null): SparkmatesSource {
  if (raw === "nfc_card" || raw === "qr_code" || raw === "direct_link") {
    return raw;
  }

  return "direct_link";
}

export default function SparkmatesPage({
  params,
}: {
  params: Promise<{ gdgId: string }>;
}) {
  const { gdgId } = React.use(params);
  const searchParams = useSearchParams();
  const source = normalizeSource(searchParams.get("source"));

  const { user, token } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<SparkmatesResponse["data"] | null>(
    null,
  );

  const isOwner = useMemo(() => {
    const authGdgId = user?.user_metadata?.gdg_id;
    return Boolean(authGdgId && authGdgId === gdgId);
  }, [user?.user_metadata?.gdg_id, gdgId]);

  const fetchSparkmates = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = configs.nexusApiBaseUrl.endsWith("/")
        ? configs.nexusApiBaseUrl
        : `${configs.nexusApiBaseUrl}/`;

      const response = await fetch(
        `${baseUrl}api/v1/sparkmates/${gdgId}?source=${source}`,
      );

      const json = (await response.json()) as SparkmatesResponse;

      if (!response.ok || json.status !== "success" || !json.data) {
        throw new Error(json.message || "Failed to fetch Sparkmates profile");
      }

      setPayload(json.data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [gdgId, source]);

  React.useEffect(() => {
    fetchSparkmates();
  }, [fetchSparkmates]);

  const activateCard = async () => {
    if (!token) {
      setError("You must be signed in to activate this card.");
      return;
    }

    try {
      setActivating(true);
      setError(null);

      const baseUrl = configs.nexusApiBaseUrl.endsWith("/")
        ? configs.nexusApiBaseUrl
        : `${configs.nexusApiBaseUrl}/`;

      const response = await fetch(
        `${baseUrl}api/v1/nfc-system/nfc/${gdgId}/activate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = (await response.json()) as {
        status?: string;
        message?: string;
      };

      if (!response.ok || json.status !== "success") {
        throw new Error(json.message || "Failed to activate Sparkmates card");
      }

      await fetchSparkmates();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
          <p className="mt-4 text-zinc-400">Resolving Sparkmates profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-900/40 bg-red-950/30 p-6">
          <h1 className="text-xl font-semibold text-red-300">
            Unable to load Sparkmates profile
          </h1>
          <p className="mt-2 text-red-200/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!payload) {
    return null;
  }

  const isActivated = payload.status === "activated";

  if (!isActivated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="text-2xl font-bold">Sparkmates Profile Not Active</h1>
          <p className="mt-3 text-zinc-300">
            This digital portfolio is not activated yet.
          </p>
          <p className="mt-1 text-sm text-zinc-500">GDG ID: {payload.gdg_id}</p>
          <p className="mt-1 text-sm text-zinc-500">Source: {payload.source}</p>

          {isOwner ? (
            <button
              onClick={activateCard}
              disabled={activating}
              className="mt-6 w-full rounded-lg bg-white px-4 py-2 font-medium text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activating ? "Activating..." : "Activate Sparkmates Profile"}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const portfolio = payload.portfolio;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <main className="mx-auto max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Sparkmates
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          {portfolio?.full_name || portfolio?.nickname || payload.gdg_id}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">GDG ID: {payload.gdg_id}</p>

        <p className="mt-6 text-zinc-300">
          {portfolio?.bio || "No bio available yet."}
        </p>

        <div className="mt-8 grid gap-3">
          {portfolio?.github_url ? (
            <a
              className="rounded-lg border border-zinc-700 px-4 py-2 hover:border-zinc-500"
              href={portfolio.github_url}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          ) : null}
          {portfolio?.linkedin_url ? (
            <a
              className="rounded-lg border border-zinc-700 px-4 py-2 hover:border-zinc-500"
              href={portfolio.linkedin_url}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          ) : null}
          {portfolio?.portfolio_website_url ? (
            <a
              className="rounded-lg border border-zinc-700 px-4 py-2 hover:border-zinc-500"
              href={portfolio.portfolio_website_url}
              target="_blank"
              rel="noreferrer"
            >
              Website
            </a>
          ) : null}
        </div>
      </main>
    </div>
  );
}
