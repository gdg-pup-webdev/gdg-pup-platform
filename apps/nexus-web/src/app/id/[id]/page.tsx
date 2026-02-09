"use client";

import { useParams } from "next/navigation";
import React from "react";

const PortfolioPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [userData, setUserData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Default to localhost:8000 if env var is missing
        const apiUrl =
          process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000/";
        const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

        const res = await fetch(
          `${baseUrl}api/user-system/users/${id}/aggregate`,
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch user profile: ${res.statusText}`);
        }

        const json = await res.json();
        console.log("User Aggregate Data:", json);

        if (json.status === "success" && json.data) {
          setUserData(json.data);
        } else {
          setError("User not found.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred while fetching the profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-white rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  // Map API fields to UI
  const profile = userData?.profiles?.[0]; // Get the first profile if available
  
  const displayProfile = {
    name: userData?.display_name || "GDG Member",
    role:
      profile?.program && profile?.year_level
        ? `${profile.program} - Year ${profile.year_level}`
        : profile?.program || "Member",
    bio: profile?.bio || "No bio available.",
    company: "Polytechnic University of the Philippines",
    location: "Manila, Philippines",
    // Use user's avatar_url if available, fallback to deterministic avatar
    avatar:
      userData?.avatar_url ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    socials: [
      profile?.github_url && {
        name: "GitHub",
        url: profile.github_url,
        icon: "GH",
      },
      profile?.linkedin_url && {
        name: "LinkedIn",
        url: profile.linkedin_url,
        icon: "LI",
      },
      profile?.portfolio_url && {
        name: "Website",
        url: profile.portfolio_url,
        icon: "WB",
      },
    ].filter(Boolean) as { name: string; url: string; icon: string }[],
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col p-6">
        {/* Profile Card */}
        <div className="mt-12 mb-8 flex flex-col items-center text-center">
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-md opacity-75 animate-pulse"></div>
            <div className="relative w-full h-full rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayProfile.avatar}
                alt={displayProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-2">
            {displayProfile.name}
          </h1>
          <p className="text-purple-400 font-medium mb-1">
            {displayProfile.role}
          </p>
          <p className="text-zinc-500 text-sm mb-6">{displayProfile.company}</p>

          <p className="text-zinc-300 leading-relaxed mb-8 max-w-xs">
            {displayProfile.bio}
          </p>

          <div className="w-full space-y-3">
            <button className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-purple-500/10 flex items-center justify-center gap-2 cursor-pointer">
              <span>Save Contact</span>
            </button>
            <button className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <span>Share Profile</span>
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider pl-1">
            Connect
          </h2>
          {displayProfile.socials.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {displayProfile.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group backdrop-blur-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors font-bold text-xs">
                      {social.icon}
                    </div>
                    <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {social.name}
                    </span>
                  </div>
                  <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    →
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 text-sm italic pl-1">
              No social links available.
            </p>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-12 pt-8 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-600 font-mono">ID: {id}</p>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;
