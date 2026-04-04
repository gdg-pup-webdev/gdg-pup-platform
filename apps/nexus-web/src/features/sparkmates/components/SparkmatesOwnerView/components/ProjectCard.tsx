"use client";
import { Text } from "@packages/spark-ui";

export function ProjectCard({ image }: { image: string; }) {
  return (
    <article className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
      <Text variant="body" className="text-white" weight="medium">
        Project Title
      </Text>
      <Text variant="body-sm" className="mt-1 text-[#C1C7CD]">
        Month Year · Month Year
      </Text>
      <Text variant="body-sm" className="mt-1 text-[#E5E5E5]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
        ullamcorper sed eros, non sollicitudin.
      </Text>
      <img
        src={image}
        alt="Project preview"
        className="mt-2 h-20 w-full rounded-md object-cover" />
    </article>
  );
}
