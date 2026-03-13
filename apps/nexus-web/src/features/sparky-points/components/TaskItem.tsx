"use client";
import { cn } from "@/lib/utils";
import { Text } from "@packages/spark-ui";
import type { TaskItemType } from "../types";
import { RAINBOW_BORDER } from "./SparkyPointsSection";

export function TaskItem({ id, name, points, description }: TaskItemType) {
    return (
        <a className={cn(RAINBOW_BORDER, "p-4 h-25 lg:h-auto flex flex-col relative isolate rounded-lg shadow-[0px_4px_16px_0px_#FFFFFF0D_inset]")}
            id={`tasks-${id}`}
        >
            <span className="flex justify-between items-center">
                <Text gradient="white-yellow" className="font-bold">{name}</Text>
                <Text color="success" variant="body-sm">+{points} pts</Text>
            </span>
            <Text color="muted" variant="body-sm" clamp={3}>{description}</Text>
        </a>
    );
}
