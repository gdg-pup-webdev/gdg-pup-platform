"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Search, User as UserIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchUsers } from "@/features/users";

export interface AdminUserSearchOption {
  gdgId: string;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

interface AdminUserSearchFieldProps {
  label: string;
  selectedUsers: AdminUserSearchOption[];
  onChange: (users: AdminUserSearchOption[]) => void;
  excludeUserIds?: string[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  minQueryLength?: number;
  maxSelections?: number;
  emptySearchText?: string;
  emptySelectionText?: string;
  containerClassName?: string;
  disabled?: boolean;
  limit?: number;
}

type RawUser = {
  gdgId?: string;
  gdg_id?: string;
  displayName?: string | null;
  display_name?: string | null;
  firstName?: string | null;
  first_name?: string | null;
  lastName?: string | null;
  last_name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
};

const normalizeUser = (user: RawUser): AdminUserSearchOption | null => {
  const gdgId = user?.gdgId ?? user?.gdg_id;

  if (!gdgId || typeof gdgId !== "string") {
    return null;
  }

  return {
    gdgId,
    displayName: user?.displayName ?? user?.display_name ?? null,
    firstName: user?.firstName ?? user?.first_name ?? null,
    lastName: user?.lastName ?? user?.last_name ?? null,
    email: user?.email ?? null,
    avatarUrl: user?.avatarUrl ?? user?.avatar_url ?? null,
  };
};

const getUserDisplayName = (user: AdminUserSearchOption) => {
  const fallbackName = [user.firstName, user.lastName]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join(" ")
    .trim();

  return user.displayName || fallbackName || "Unnamed User";
};

export function AdminUserSearchField({
  label,
  selectedUsers,
  onChange,
  excludeUserIds = [],
  placeholder = "Search users by name or email...",
  helperText,
  error,
  required,
  minQueryLength = 2,
  maxSelections = Infinity,
  emptySearchText = "No matching users found.",
  emptySelectionText = "No users selected yet.",
  containerClassName,
  disabled = false,
  limit = 10,
}: AdminUserSearchFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: usersResponse, isLoading: isSearching } = useSearchUsers(
    debouncedQuery,
    limit,
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedUserIds = useMemo(
    () => new Set(selectedUsers.map((user) => user.gdgId)),
    [selectedUsers],
  );

  const blockedUserIds = useMemo(
    () => new Set([...excludeUserIds, ...selectedUsers.map((user) => user.gdgId)]),
    [excludeUserIds, selectedUsers],
  );

  const searchResults = useMemo(() => {
    const rawUsers = Array.isArray(usersResponse?.data)
      ? (usersResponse.data as RawUser[])
      : [];

    return rawUsers
      .map(normalizeUser)
      .filter(
        (user): user is AdminUserSearchOption =>
          Boolean(user && !blockedUserIds.has(user.gdgId)),
      );
  }, [blockedUserIds, usersResponse?.data]);

  const canSearch = searchQuery.trim().length >= minQueryLength;
  const reachedMaxSelections = selectedUsers.length >= maxSelections;

  const handleSelectUser = (user: AdminUserSearchOption) => {
    if (disabled || selectedUserIds.has(user.gdgId)) {
      return;
    }

    if (maxSelections === 1) {
      onChange([user]);
      setSearchQuery(getUserDisplayName(user));
      setShowDropdown(false);
      return;
    }

    if (reachedMaxSelections) {
      return;
    }

    onChange([...selectedUsers, user]);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleRemoveUser = (gdgId: string) => {
    if (disabled) {
      return;
    }

    onChange(selectedUsers.filter((user) => user.gdgId !== gdgId));
  };

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>

      {helperText ? <p className="text-xs text-gray-500">{helperText}</p> : null}

      <div className="space-y-3">
        <div className="relative" ref={dropdownRef}>
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            className={cn(
              "w-full rounded-sm border bg-white py-2.5 pr-10 pl-10 text-sm outline-none transition-all focus:ring-2",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 focus:border-teal-500 focus:ring-teal-500/20",
              disabled && "cursor-not-allowed bg-gray-50 text-gray-400",
            )}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            disabled={disabled}
          />

          {isSearching ? (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          ) : null}

          {showDropdown && canSearch && !disabled ? (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-gray-100 bg-white shadow-xl">
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <button
                    key={user.gdgId}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-teal-50"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={getUserDisplayName(user)}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <UserIcon size={16} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {getUserDisplayName(user)}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email || user.gdgId}
                      </p>
                    </div>
                  </button>
                ))
              ) : !isSearching ? (
                <div className="p-4 text-center text-sm italic text-gray-500">
                  {emptySearchText}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <div
                key={user.gdgId}
                className="flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 py-1 pl-1.5 pr-2"
              >
                <div className="relative h-5 w-5 overflow-hidden rounded-full bg-teal-200">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={getUserDisplayName(user)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-teal-700">
                      {getUserDisplayName(user).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <span className="max-w-45 truncate text-xs font-bold text-teal-900">
                  {getUserDisplayName(user)}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveUser(user.gdgId)}
                  className="text-teal-600 hover:text-teal-800 disabled:cursor-not-allowed disabled:text-teal-300"
                  disabled={disabled}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="py-1 text-xs italic text-gray-400">{emptySelectionText}</p>
          )}
        </div>

        {maxSelections !== Infinity ? (
          <p className="text-[10px] text-gray-400">
            {selectedUsers.length}/{maxSelections} selected
          </p>
        ) : null}
      </div>

      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
