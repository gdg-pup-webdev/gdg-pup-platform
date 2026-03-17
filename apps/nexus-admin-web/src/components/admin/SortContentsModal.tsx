"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical, Loader2, ArrowUpDown, AlertTriangle } from "lucide-react";
import { extractApiError } from "@/lib/apiError";
import { useSupabaseAuthContext } from "@/providers/SupabaseAuthProvider";

// ==========================================
// Types
// ==========================================
export interface SortableItem {
    id: string;
    rankingIndex: number;
    [key: string]: any;
}

interface SortContentsModalProps {
    /** API path e.g. "/api/certifications" */
    apiPath: string;
    /** Field name to display as the card title */
    labelKey: string;
    /** Optional secondary label key */
    subLabelKey?: string;
    /** Field name for the image */
    imageKey: string;
    /** Modal title */
    title: string;
    /** Callback to close the modal */
    onClose: () => void;
    /** Callback when sorting has changed (to invalidate caches in parent) */
    onSortComplete: () => void;
}

// ==========================================
// Constants
// ==========================================
const NORMALIZATION_THRESHOLD = 1;
const NORMALIZATION_SPACING = 1000;

// ==========================================
// Main Component
// ==========================================
export function SortContentsModal({
    apiPath,
    labelKey,
    subLabelKey,
    imageKey,
    title,
    onClose,
    onSortComplete,
}: SortContentsModalProps) {
    const [items, setItems] = useState<SortableItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const supabaseAuthContext = useSupabaseAuthContext();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    // Fetch all items on mount
    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${apiPath}?all=true`, {
                    headers: {
                        Authorization: `Bearer ${supabaseAuthContext.supabaseAccessToken}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch items");
                const json = await res.json();
                setItems(json.data || []);
            } catch (err: any) {
                setError("We couldn't load the items for sorting. Please close this window and try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [apiPath]);

    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Escape key to close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const updateRankingIndex = useCallback(
        async (id: string, rankingIndex: number) => {
            const formData = new FormData();
            formData.append("rankingIndex", rankingIndex.toString());

            const res = await fetch(`${apiPath}/${id}`, {
                method: "PATCH",
                body: formData,
                headers: {
                    Authorization: `Bearer ${supabaseAuthContext.supabaseAccessToken}`,
                },
            });

            if (!res.ok) {
                throw await extractApiError(res, "We couldn't save the new order. Please try moving the item again.");
            }
        },
        [apiPath],
    );

    const normalizeAll = useCallback(
        async (sortedItems: SortableItem[]) => {
            setSaving(true);
            try {
                const updates = sortedItems.map((item, index) => ({
                    ...item,
                    rankingIndex: (index + 1) * NORMALIZATION_SPACING,
                }));

                // Update all items in parallel
                await Promise.all(
                    updates.map((item) => updateRankingIndex(item.id, item.rankingIndex)),
                );

                setItems(updates);
            } catch (err: any) {
                setError("Something went wrong while reordering all items. Please close this window and try again.");
            } finally {
                setSaving(false);
            }
        },
        [updateRankingIndex],
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Calculate new ranking index
        let newRankingIndex: number;
        const movedItemIdx = newIndex;

        if (movedItemIdx === 0) {
            // First position
            newRankingIndex = newItems[1]
                ? newItems[1].rankingIndex - NORMALIZATION_SPACING
                : NORMALIZATION_SPACING;
        } else if (movedItemIdx === newItems.length - 1) {
            // Last position
            newRankingIndex =
                newItems[movedItemIdx - 1].rankingIndex + NORMALIZATION_SPACING;
        } else {
            // Middle position — average of neighbors
            const left = newItems[movedItemIdx - 1].rankingIndex;
            const right = newItems[movedItemIdx + 1].rankingIndex;
            newRankingIndex = (left + right) / 2;

            // Check if normalization is needed
            if (Math.abs(right - left) < NORMALIZATION_THRESHOLD) {
                // Differences too small — normalize all
                const normalizedItems = newItems.map((item, i) => ({
                    ...item,
                    rankingIndex:
                        item.id === active.id
                            ? (movedItemIdx + 1) * NORMALIZATION_SPACING
                            : item.rankingIndex,
                }));
                setItems(normalizedItems);
                await normalizeAll(newItems);
                onSortComplete();
                return;
            }
        }

        // Update the moved item's ranking index locally
        const updatedItems = newItems.map((item) =>
            item.id === active.id ? { ...item, rankingIndex: newRankingIndex } : item,
        );
        setItems(updatedItems);

        // Persist to the database
        setSaving(true);
        try {
            await updateRankingIndex(active.id as string, newRankingIndex);
        } catch (err: any) {
            setError(err.message || "We couldn't save the new position. The order has been reverted — please try again.");
            // Revert on failure
            setItems(items);
        } finally {
            setSaving(false);
            onSortComplete();
        }
    };

    const activeItem = activeId
        ? items.find((item) => item.id === activeId)
        : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-sm bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#2F80ED]/10">
                            <ArrowUpDown size={18} className="text-[#2F80ED]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                            <p className="text-xs text-gray-500">
                                Drag and drop to reorder items
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {saving && (
                            <div className="flex items-center gap-2 rounded-sm bg-blue-50 px-2 py-1.5 text-xs font-medium text-[#2F80ED] sm:px-3">
                                <Loader2 size={14} className="animate-spin" />
                                <span className="hidden sm:inline">Saving...</span>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="rounded-sm p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mx-6 mt-4 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 px-4 py-3">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-red-800">Couldn&apos;t update order</p>
                            <p className="mt-0.5 text-sm text-red-600">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="shrink-0 text-red-400 hover:text-red-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-3">
                            <Loader2 className="animate-spin text-[#2F80ED]" size={36} />
                            <p className="text-sm text-gray-500">Loading items...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-2 text-gray-400">
                            <ArrowUpDown size={40} className="text-gray-300" />
                            <p className="text-sm">No items to sort</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={items.map((i) => i.id)}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                    {items.map((item) => (
                                        <SortableCard
                                            key={item.id}
                                            item={item}
                                            labelKey={labelKey}
                                            subLabelKey={subLabelKey}
                                            imageKey={imageKey}
                                            isDragging={activeId === item.id}
                                        />
                                    ))}
                                </div>
                            </SortableContext>

                            <DragOverlay adjustScale={false}>
                                {activeItem ? (
                                    <OverlayCard
                                        item={activeItem}
                                        labelKey={labelKey}
                                        subLabelKey={subLabelKey}
                                        imageKey={imageKey}
                                    />
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-6 py-4">
                    <p className="text-xs text-gray-400">
                        {items.length} item{items.length !== 1 ? "s" : ""}
                    </p>
                    <button
                        onClick={onClose}
                        className="rounded-sm bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// Sortable Card Component
// ==========================================
function SortableCard({
    item,
    labelKey,
    subLabelKey,
    imageKey,
    isDragging,
}: {
    item: SortableItem;
    labelKey: string;
    subLabelKey?: string;
    imageKey: string;
    isDragging: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isSorting,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const label = item[labelKey] || "Untitled";
    const subLabel = subLabelKey ? item[subLabelKey] : null;
    const imageUrl = item[imageKey];

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative flex flex-col items-center gap-2.5 rounded border-2 p-3 transition-all ${isDragging
                ? "z-10 border-[#2F80ED] bg-blue-50/50 opacity-40"
                : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                }`}
        >
            {/* Drag Handle */}
            <button
                className="absolute right-1.5 top-1.5 cursor-grab rounded-sm p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-500 active:cursor-grabbing"
                style={{ touchAction: "none" }}
                {...attributes}
                {...listeners}
            >
                <GripVertical size={14} />
            </button>

            {/* Image */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={label}
                        className="h-full w-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <span className="text-xl font-bold">
                            {label.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Label */}
            <div className="w-full text-center">
                <p className="truncate text-xs font-semibold text-gray-800">{label}</p>
                {subLabel && (
                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                        {subLabel}
                    </p>
                )}
            </div>
        </div>
    );
}

// ==========================================
// Drag Overlay Card
// ==========================================
function OverlayCard({
    item,
    labelKey,
    subLabelKey,
    imageKey,
}: {
    item: SortableItem;
    labelKey: string;
    subLabelKey?: string;
    imageKey: string;
}) {
    const label = item[labelKey] || "Untitled";
    const subLabel = subLabelKey ? item[subLabelKey] : null;
    const imageUrl = item[imageKey];

    return (
        <div className="flex flex-col items-center gap-2.5 rounded border-2 border-[#2F80ED] bg-white p-3 shadow-xl ring-4 ring-[#2F80ED]/20">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={label}
                        className="h-full w-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <span className="text-xl font-bold">
                            {label.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>
            <div className="w-full text-center">
                <p className="truncate text-xs font-semibold text-gray-800">{label}</p>
                {subLabel && (
                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                        {subLabel}
                    </p>
                )}
            </div>
        </div>
    );
}
