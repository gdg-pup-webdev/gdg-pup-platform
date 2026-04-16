import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export async function addEventImage(
  eventId: string,
  image: File,
  token?: string,
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.events.eventId.images.POST,
    {
      token: token ?? undefined,
      params: { eventId },
      body: {},
      files: { image },
    },
  );

  if (result.status === 200 && result.body) {
    return result.body.data;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to add event image");
}

export async function deleteEventImage(
  eventId: string,
  imageIndex: number,
  token?: string,
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.events.eventId.images.imageIndex.DELETE,
    {
      token: token ?? undefined,
      params: {
        eventId,
        imageIndex: String(imageIndex),
      },
    },
  );

  if (result.status === 200 && result.body) {
    return result.body.data;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to delete event image");
}

export async function reorderEventImages(
  eventId: string,
  fromIndex: number,
  toIndex: number,
  token?: string,
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.events.eventId.images.reorder.PATCH,
    {
      token: token ?? undefined,
      params: { eventId },
      body: {
        data: {
          fromIndex,
          toIndex,
        },
      },
    },
  );

  if (result.status === 200 && result.body) {
    return result.body.data;
  }

  throw new Error(extractErrorMessage(result.body) || "Failed to reorder event images");
}
