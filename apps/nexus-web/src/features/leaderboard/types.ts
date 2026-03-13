export type LeaderboardView = "landing" | "members" | "core" | "summary";

export interface LeaderboardEntry {
    rank: number;
    name: string;
    role: string;
    points: number;
    avatarUrl?: string;
    isCurrentUser?: boolean;
}

export interface PodiumEntry {
    name: string;
    points: number;
    avatarUrl?: string;
}
