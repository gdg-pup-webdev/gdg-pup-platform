"use client";
import { Stack } from "@packages/spark-ui";
import { createPortal } from "react-dom";

export function Modal({ children, isOpen, onClose }: {
    children?: React.ReactNode | null | undefined;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) return null;

    return createPortal(
        <>
            <div className="fixed bg-[#000000A0] inset-0 z-50 grid place-items-center p-8" onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClose();
            }}>
                <Stack className="bg-[#010B1D] w-full max-w-112 p-4 lg:p-6 gap-4 rounded-t-2xl lg:rounded-2xl box-border" align="center" onClick={(e) => {
                    e.stopPropagation();
                }}>{children}</Stack>

            </div>
        </>,
        document.body);

}
