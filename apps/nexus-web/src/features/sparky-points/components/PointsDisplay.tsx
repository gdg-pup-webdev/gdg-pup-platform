"use client";
import { ASSETS } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import { Stack, Inline, Text } from "@packages/spark-ui";
import { RAINBOW_BORDER } from "./SparkyPointsSection";

export function PointsDisplay({ points }: { points: number; }) {
    return (
        <Stack>
            <div className={cn(RAINBOW_BORDER, "flex rounded-lg gap-4 p-4 shadow-[0px_4px_16px_0px_#FFFFFF40_inset]")}
            >
                <Inline gap={"xs"} className="flex-1">
                    <Text variant={"heading-3"} gradient={"white-yellow"}>{points}</Text>
                    <Text gradient={"white-yellow"} variant={"body-lg"}>point{points === 1 ? "" : "s"}</Text>
                </Inline>
                <div className="aspect-square h-full max-h-25">
                    <img src={ASSETS.SPARKY_POINTS.CIRBY_DISPLAY} alt="CIRBY STICKER" className="w-full h-full" />
                </div>
            </div>
            <Text variant="body-sm" color="muted">Spark Points reflect your participation and contributions across GDG PUP events and activities. They’re designed to recognize effort, not competition.</Text>
        </Stack>
    );
}
