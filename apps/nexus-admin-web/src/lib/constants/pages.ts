import {
	Award,
	Calendar,
	Files,
	Globe,
	GraduationCap,
	LayoutDashboard,
	Link2,
	MessageSquareQuote,
	Shield,
	Sparkles,
	User,
	Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EXTERNAL_LINKS, INTERNAL_LINKS } from "@/lib/constants/links";

export type AdminPageKey =
	| "dashboard"
	| "profile"
	| "articles"
	| "memberProjects"
	| "members"
	| "teams"
	| "files"
	| "learningResources"
	| "memberShowcase"
	| "events"
	| "bevyEvents"
	| "rolesPermissions"
	| "debug"
	| "portfolios";

type AdminPageMatchMode = "exact" | "prefix";

export interface AdminPageMeta {
	key: AdminPageKey;
	href: string;
	title: string;
	description: string;
	icon: LucideIcon;
	sidebarLabel?: string;
	matchMode?: AdminPageMatchMode;
	sidebarVisible?: boolean;
	dashboardVisible?: boolean;
}

export const ADMIN_PAGE_META: Record<AdminPageKey, AdminPageMeta> = {
	dashboard: {
		key: "dashboard",
		href: INTERNAL_LINKS.DASHBOARD,
		title: "Dashboard",
		description: "Manage your platform content and operations from one place.",
		icon: LayoutDashboard,
		matchMode: "exact",
		dashboardVisible: false,
	},
	profile: {
		key: "profile",
		href: INTERNAL_LINKS.PROFILE,
		title: "User Profile",
		description: "Manage account settings, credentials, and profile information.",
		icon: User,
	},
	articles: {
		key: "articles",
		href: INTERNAL_LINKS.ARTICLES,
		title: "Articles",
		description: "Curate and publish community stories, highlights, and updates.",
		icon: Link2,
	},
	memberProjects: {
		key: "memberProjects",
		href: INTERNAL_LINKS.MEMBER_PROJECTS,
		title: "Member Projects",
		description: "Showcase member-built projects and maintain project portfolios.",
		icon: Link2,
		sidebarLabel: "Member Projects",
	},
	members: {
		key: "members",
		href: INTERNAL_LINKS.MEMBERS,
		title: "Member Management",
		description: "Browse and manage all GDG member records.",
		icon: User,
	},
	teams: {
		key: "teams",
		href: INTERNAL_LINKS.TEAMS,
		title: "Teams",
		description: "Create, organize, and maintain GDG operational teams.",
		icon: Users,
	},
	files: {
		key: "files",
		href: INTERNAL_LINKS.FILES,
		title: "File System",
		description: "Upload, organize, and manage files and folders across the platform.",
		icon: Files,
	},
	learningResources: {
		key: "learningResources",
		href: INTERNAL_LINKS.LEARNING_RESOURCES,
		title: "Learning Resources",
		description: "Maintain curated resources, references, and educational assets.",
		icon: GraduationCap,
		sidebarLabel: "Learning Resources",
	},
	memberShowcase: {
		key: "memberShowcase",
		href: INTERNAL_LINKS.MEMBER_SHOWCASE,
		title: "Member Showcase",
		description: "Highlight achievements and stories from community members.",
		icon: Sparkles,
		sidebarLabel: "Member Showcase",
	},
	events: {
		key: "events",
		href: INTERNAL_LINKS.EVENTS,
		title: "Event Management",
		description: "Create, manage, and track all Nexus event records.",
		icon: Calendar,
		sidebarLabel: "Nexus Events",
	},
	bevyEvents: {
		key: "bevyEvents",
		href: INTERNAL_LINKS.BEVY_EVENTS,
		title: "Bevy Events",
		description: "Review Bevy event feeds and import external event data.",
		icon: MessageSquareQuote,
		sidebarLabel: "Bevy Events",
	},
	rolesPermissions: {
		key: "rolesPermissions",
		href: INTERNAL_LINKS.RBAC,
		title: "Roles and Permissions",
		description: "Define role policies and manage role assignments.",
		icon: Shield,
		sidebarLabel: "Roles",
	},
	debug: {
		key: "debug",
		href: INTERNAL_LINKS.DEBUG_PAGE,
		title: "System Diagnostics",
		description: "Monitor service health, contracts, and connectivity checks.",
		icon: Award,
		sidebarLabel: "Debug",
	},
	portfolios: {
		key: "portfolios",
		href: INTERNAL_LINKS.PORTFOLIOS,
		title: "Portfolio Management",
		description: "View and maintain published member portfolios.",
		icon: User,
		sidebarLabel: "Portfolios",
		sidebarVisible: false,
	},
};

export const ADMIN_SIDEBAR_SECTIONS: Array<{
	key: string;
	label: string;
	items: AdminPageKey[];
}> = [
	{
		key: "content",
		label: "Content",
		items: [
			"dashboard",
			"profile",
			"articles",
			"memberProjects",
			"members",
			"teams",
			"files",
			"learningResources",
			"memberShowcase",
			"debug",
			"rolesPermissions",
		],
	},
	{
		key: "events",
		label: "Events",
		items: ["events", "bevyEvents"],
	},
];

export const ADMIN_EXTERNAL_NAV_ITEMS: Array<{
	label: string;
	href: string;
	icon: LucideIcon;
}> = [
	{
		label: "View Live Website",
		href: EXTERNAL_LINKS.LIVE_WEBSITE,
		icon: Globe,
	},
];

function uniquePageKeys(keys: AdminPageKey[]): AdminPageKey[] {
	const seen = new Set<AdminPageKey>();
	return keys.filter((key) => {
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
}

const ADMIN_SIDEBAR_PAGE_KEYS = ADMIN_SIDEBAR_SECTIONS.flatMap((section) => section.items);

const ADMIN_META_PAGE_KEYS = Object.keys(ADMIN_PAGE_META) as AdminPageKey[];

export const ADMIN_PAGE_KEYS_IN_ORDER: AdminPageKey[] = uniquePageKeys([
	...ADMIN_SIDEBAR_PAGE_KEYS,
	...ADMIN_META_PAGE_KEYS,
]);

export const ADMIN_PAGES_IN_ORDER: AdminPageMeta[] = ADMIN_PAGE_KEYS_IN_ORDER.map(
	(key) => ADMIN_PAGE_META[key],
);

export const ADMIN_DASHBOARD_PAGES: AdminPageMeta[] = ADMIN_PAGES_IN_ORDER.filter(
	(page) => page.dashboardVisible !== false && page.key !== "dashboard",
);

export function getAdminPageMetaByPathname(pathname: string): AdminPageMeta | null {
	const sortedBySpecificity = Object.values(ADMIN_PAGE_META).sort(
		(a, b) => b.href.length - a.href.length,
	);

	for (const meta of sortedBySpecificity) {
		const matchMode = meta.matchMode || "prefix";
		if (matchMode === "exact") {
			if (pathname === meta.href) {
				return meta;
			}
			continue;
		}

		if (pathname === meta.href || pathname.startsWith(`${meta.href}/`)) {
			return meta;
		}
	}

	return null;
}
