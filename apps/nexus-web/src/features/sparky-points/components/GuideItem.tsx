/* eslint-disable @next/next/no-img-element */
"use client";
import { ASSETS } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import { Stack, Text } from "@packages/spark-ui";
import { RAINBOW_BORDER } from "./SparkyPointsSection";

export function GuideItem({ title, children, clamp }: { title: string; children: string; clamp?: 1 | "none" | 2 | 3 | 4 | null | undefined; }) {
    return (
        <Stack gap="xs" className={cn(RAINBOW_BORDER, "relative isolate rounded-lg p-4 shadow-[0px_4px_16px_0px_#FFFFFF40]")}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex">
                        <img
                            src={ASSETS.PROFILE.SPARKY_POINTS.SPARKY_FACE}
                            alt="sparky"
                            className="w-full h-full" />
                    </div>
                    <Text gradient="white-blue" weight="bold" className="text-lg">{title}</Text>
                </div>
            </div>
            <Text variant="body" className="text-inherit" clamp={clamp}>
                {children}
            </Text>
        </Stack>
    );
}
