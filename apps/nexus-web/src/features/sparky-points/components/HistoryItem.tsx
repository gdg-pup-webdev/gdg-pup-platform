/* eslint-disable @next/next/no-img-element */
"use client";
import { ASSETS } from "@/lib/constants/assets";
import { cn, formatDate } from "@/lib/utils";
import { Stack, Text } from "@packages/spark-ui";
import { CircledMinusSvg } from "../icons/CircledMinusSvg";
import { CircledPlusSvg } from "../icons/CircledPlusSvg";
import type { PointsTransactionType } from "../types";
import { RAINBOW_BORDER } from "./SparkyPointsSection";

export function HistoryItem({ type, data, avatar }: PointsTransactionType & {
    avatar: string;
}) {
    const isEarned = type === "plus";
    return (
        <Stack gap="xs" className={cn(RAINBOW_BORDER, "relative isolate rounded-lg p-4 shadow-[0px_4px_16px_0px_#FFFFFF40_inset]")}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex">
                        <img
                            src={avatar || ASSETS.PROFILE.SPARKY_POINTS.SPARKY_FACE}
                            alt="sparky"
                            className={`w-full h-full ${avatar !== "" ? "rounded-full" : ""}`} />
                    </div>
                    <Text variant="body-sm" color="muted">{formatDate(data.timestamp)}</Text>
                </div>
                <Text as="div" variant="body-sm" color={isEarned ? "success" : "error"} className="flex items-center gap-2">
                    {isEarned
                        ? <CircledPlusSvg />
                        : <CircledMinusSvg />}
                    {isEarned ? data.points : data.cost} pts
                </Text>
            </div>
            <Text variant="body" className="text-inherit">
                {isEarned
                    ? <>You earned <strong>+{data.points}</strong> Sparky Points after completing <strong>{data.name}</strong>.</>
                    : <>You redeemed <strong>{data.name}</strong> for <strong>{data.cost}</strong> points.</>}
            </Text>
        </Stack>
    );
}
