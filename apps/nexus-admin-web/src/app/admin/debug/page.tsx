"use client";

import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { Activity, CheckCircle2, XCircle, RefreshCw, Server, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { configs } from "@/lib/constants/configs";

const NEXUS_API_URL = configs.nexusApiBaseUrl;

export default function DebugPage() {
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const { data: nexusHealth, isLoading: isLoadingNexus, isError: isErrorNexus, refetch: refetchNexus, isFetching: isFetchingNexus } = useQuery({
    queryKey: ["health", "nexus"],
    queryFn: async () => {
      const result = await callEndpoint(
        NEXUS_API_URL,
        contract.api.v1.health.GET,
        {}
      );
      setLastChecked(new Date());
      return result;
    },
  });

  const handleRefreshAll = () => {
    refetchNexus();
  };

  return (
    <AdminPageScaffold
      pageKey="debug"
      actions={
        <AdminActionButton
          onClick={handleRefreshAll}
          isLoading={isFetchingNexus}
          loadingLabel="Refreshing"
          variant="brand"
        >
          <RefreshCw size={16} />
          Refresh Status
        </AdminActionButton>
      }
    >

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nexus API Card */}
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100">
                  <Server size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Nexus API</h2>
                  <p className="text-xs text-gray-500">{NEXUS_API_URL}</p>
                </div>
              </div>
              <div>
                {isLoadingNexus ? (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    Checking...
                  </span>
                ) : isErrorNexus ? (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Offline
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Healthy
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                {isErrorNexus ? (
                  <XCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
                ) : (
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isErrorNexus ? "Connection Failed" : "Connection Established"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isErrorNexus 
                      ? "Unable to reach the Nexus API server. Please ensure it is running."
                      : "Successfully communicated with the API server."}
                  </p>
                </div>
              </div>

              {!isErrorNexus && nexusHealth && (
                <div className="mt-4 rounded bg-gray-50 p-3">
                  <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Raw Response
                  </p>
                  <pre className="overflow-x-auto text-[11px] text-gray-600">
                    {JSON.stringify(nexusHealth, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Identity API Card (Placeholder) */}
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm opacity-60">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-teal-100">
                  <ShieldCheck size={20} className="text-teal-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Identity API</h2>
                  <p className="text-xs text-gray-500">http://localhost:8001</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Disabled
              </span>
            </div>
          </div>
          <div className="flex h-40 items-center justify-center p-6 text-center">
            <p className="text-sm text-gray-400 italic">
              Identity API diagnostics are currently unavailable in this environment.
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-8 rounded-sm border border-blue-100 bg-blue-50/50 p-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Activity size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Diagnostic Information</h3>
            <p className="mt-1 text-sm text-gray-600">
              This page verifies end-to-end type safety and connectivity using `@packages/typed-rest`. 
              If the Status is "Offline", ensure the respective backend service is running locally.
            </p>
            {lastChecked && (
              <p className="mt-3 text-[11px] text-gray-400 font-medium">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminPageScaffold>
  );
}
