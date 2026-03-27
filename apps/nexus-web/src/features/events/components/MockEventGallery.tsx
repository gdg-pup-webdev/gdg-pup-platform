"use client";

/**
 * TODO:
 * - This component is for testing purposes only. Replace this with the actual component implementing the figma design.
 */

import React from "react";
import { useEvents } from "../hooks/useEvents";
import { WireframePagination } from "@/components/wireframing-ui/WireframePagination";
import { WireframeCard } from "@/components/wireframing-ui/WireframeCard";

export const MockEventGallery = () => {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data, error, isLoading } = useEvents({
    pageNumber: pageNumber,
    pageSize: pageSize,
  });

  return (
    <>
      <div>
        <div>mock event gallery</div>
        <WireframePagination
          currentPage={data?.meta.currentPage || 1}
          totalPages={data?.meta.totalPages || 1}
          pageSize={data?.meta.pageSize || 10}
          totalRecords={data?.meta.totalRecords || 0}
          onPageChange={setPageNumber}
          onPageSizeChange={setPageSize}
        />
        <div className="flex flex-col gap-2">
          {isLoading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {data && (
            <>
              {data.data.map((event) => (
                <WireframeCard>
                  <img src={event.banner_url} alt={event.title} className="w-full h-auto rounded-lg" />
                  <div className="font-bold text-lg">{event.title}</div>
                  <div>{event.description}</div>
                </WireframeCard>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};
