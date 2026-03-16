"use client";

import { useQuery } from "@tanstack/react-query"
import { callEndpoint } from "@packages/typed-rest/clientReact"
import { contract } from "@packages/nexus-api-contracts"

export default function LandingPage() {



  const { data, isLoading, error } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const result = callEndpoint(
        "http://localhost:8000",
        contract.api.v1.health.GET,
        {}
      )

      return result
    }
  })

  return (
    <>
      <div>admin page</div>
      <div>Nexus api health check</div>
      {
        isLoading ? <div>Loading...</div> : error ? <div>Error: {error.message}</div> : <div>{JSON.stringify(data)}</div>
      }
    </>
  );
}
