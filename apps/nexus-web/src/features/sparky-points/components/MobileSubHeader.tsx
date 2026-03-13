"use client";
import { Text } from "@packages/spark-ui";
import { LeftArrowSvg } from "../icons/LeftArrowSvg";

export function MobileSubHeader({ sectionTitle, onGoBack }: { sectionTitle: string; onGoBack: () => void; }) {
    return <>
        <div className="flex justify-between items-center">
            <a className="inline-flex w-6 h-6 items-center justify-center" onClick={onGoBack}>
                <LeftArrowSvg />
            </a>
            <Text gradient="white-blue" variant="heading-5" align="center" weight="bold">{sectionTitle}</Text>
            <a className="inline-flex w-6 h-6"></a>
        </div>
    </>;
}
