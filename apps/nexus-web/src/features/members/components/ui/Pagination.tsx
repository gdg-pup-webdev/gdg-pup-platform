"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords?: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    // Build page numbers with ellipsis
    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const total = Math.max(1, totalPages);
        const maxVisible = 5;

        if (total <= maxVisible + 2) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(total - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < total - 2) pages.push("...");
            pages.push(total);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    const effectiveTotalPages = Math.max(1, totalPages);

    return (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="rounded-sm border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-[#0B1F3B] focus:ring-1 focus:ring-[#0B1F3B]"
                >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                {totalRecords != null && (
                    <span className="ml-1 text-sm text-gray-400">
                        of {totalRecords} items
                    </span>
                )}
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1.5">
                {/* First page */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                    className="rounded-sm border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
                    title="First page"
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* Previous */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="rounded-sm border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, idx) =>
                        page === "..." ? (
                            <span key={`ellipsis-${idx}`} className="px-1.5 text-sm text-gray-400">
                                …
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={`min-w-[36px] rounded-sm px-2.5 py-1.5 text-sm font-medium transition-colors ${currentPage === page
                                    ? "bg-[#0B1F3B] text-white shadow-sm"
                                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {page}
                            </button>
                        ),
                    )}
                </div>

                {/* Next */}
                <button
                    disabled={currentPage === effectiveTotalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="rounded-sm border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
                    title="Next page"
                >
                    <ChevronRight size={16} />
                </button>

                {/* Last page */}
                <button
                    disabled={currentPage === effectiveTotalPages}
                    onClick={() => onPageChange(effectiveTotalPages)}
                    className="rounded-sm border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40"
                    title="Last page"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
}
