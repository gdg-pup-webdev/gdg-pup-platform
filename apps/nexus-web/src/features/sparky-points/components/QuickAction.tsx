"use client";
import { cn } from "@/lib/utils";
import { Text } from "@packages/spark-ui";
import { RightArrowGradientSvg } from "../icons/RightArrowGradientSvg";
import { RAINBOW_BORDER } from "./SparkyPointsSection";

export function QuickAction({ text, onNavigate }: { text: string; onNavigate: () => void; }) {
    return (
        <div className={cn(RAINBOW_BORDER, "h-25 px-3 py-2 flex items-end rounded-lg shadow-[0px_4px_16px_0px_#FFFFFF40_inset]")}>
            <a className="flex justify-between items-end gap-4 cursor-pointer w-full" onClick={onNavigate}>
                <Text weight={"bold"} className="text-inherit text-sm">{text}</Text>
                <p className="h-6 w-6 px-1 inline-flex justify-center items-center">
                    <RightArrowGradientSvg />
                </p>
            </a>
        </div>
    );
}
