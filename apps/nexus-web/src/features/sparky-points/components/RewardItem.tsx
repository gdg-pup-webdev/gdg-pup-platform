/* eslint-disable @next/next/no-img-element */
"use client";
import { cn } from "@/lib/utils";
import { Text, Button } from "@packages/spark-ui";
import type { RewardItemType } from "../types";
import { RAINBOW_BORDER } from "./SparkyPointsSection";

export function RewardItem({ id, name, cost, src, onRedeem }: RewardItemType & { onRedeem: () => void; }) {
    return (
        <div className={cn(RAINBOW_BORDER, "flex flex-col relative isolate rounded-2xl gap-4 p-4 shadow-[0px_4px_16px_0px_#FFFFFF40_inset]")}
            id={`rewards-${id}`}
        >
            <div className="aspect-square w-full">
                <img src={src} alt={`${name} - ${cost} pts`} className="w-full h-full" />
            </div>
            <Text gradient="white-yellow" align="center" variant="heading-6" weight="bold">{name}</Text>
            <Button onClick={onRedeem}>Redeem</Button>
        </div>
    );
}
