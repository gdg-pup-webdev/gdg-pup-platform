import React from "react";
import { cn } from "../../utils/cn";

export type SpotlightProps = {
    className?: string;
    fill?: string;
    id?: string;
    style?: React.CSSProperties;
};

export const Spotlight = ({ className, fill, id = "spotlight-filter", style }: SpotlightProps) => {
    return (
        <svg
            style={style}
            className={cn(
                "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%]",
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3787 2842"
            fill="none"
        >
            <g filter={`url(#${id})`}>
                <rect
                    x="1400"
                    y="0"
                    width="1000"
                    height="2842"
                    fill={fill || "white"}
                    fillOpacity="0.8"
                />
            </g>
            <defs>
                <filter
                    id={id}
                    x="-500"
                    y="-500"
                    width="4787"
                    height="3842"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    ></feBlend>
                    <feGaussianBlur
                        stdDeviation="40"
                        result="effect1_foregroundBlur_1065_8"
                    ></feGaussianBlur>
                </filter>
            </defs>
        </svg>
    );
};
