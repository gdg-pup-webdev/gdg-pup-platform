import { ImageResponse } from "next/og";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Params = {
  params: Promise<{ gdgId: string }>;
};

export default async function Image({ params }: Params) {
  const { gdgId } = await params;

  let displayName = "Sparkmate";
  let avatarUrl: string | null = null;
  let teamBadge = "Community";

  const toAbsoluteAvatarUrl = (value: string | null | undefined) => {
    if (!value) {
      return null;
    }

    if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
      return value;
    }

    if (value.startsWith("//")) {
      return `https:${value}`;
    }

    const normalized = value.startsWith("/") ? value : `/${value}`;
    return `${configs.nexusApiBaseUrl}${normalized}`;
  };

  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.gdgmembers.gdgId.GET,
      { params: { gdgId } },
    );

    if (result.status === 200 && result.body?.data) {
      const data = result.body.data;
      const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
      displayName = data.displayName || fullName || displayName;
      avatarUrl = toAbsoluteAvatarUrl(data.avatarUrl || null);
      teamBadge = data.department?.trim() || teamBadge;
    }
  } catch {
    // Fall back to defaults if profile fetch fails.
  }

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase() || "")
    .join("") || "SP";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #010B1D 0%, #13294B 45%, #1B3F73 100%)",
          color: "#FFFFFF",
          padding: "56px",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 15%, rgba(249,171,0,0.28), transparent 28%), radial-gradient(circle at 85% 85%, rgba(52,168,83,0.24), transparent 30%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "28px",
            fontWeight: 700,
            opacity: 0.95,
            zIndex: 1,
          }}
        >
          <span>GDG PUP NEXUS</span>
          <span style={{ opacity: 0.75 }}>|</span>
          <span style={{ opacity: 0.85 }}>Sparkmates</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "28px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "220px",
              height: "220px",
              borderRadius: "999px",
              overflow: "hidden",
              border: "4px solid rgba(255,255,255,0.42)",
              background: "linear-gradient(135deg, #2B7FFF 0%, #34A853 50%, #F9AB00 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
              flexShrink: 0,
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${displayName} avatar`}
                width={220}
                height={220}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "84px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  background:
                    "linear-gradient(145deg, rgba(66,133,244,0.9) 0%, rgba(52,168,83,0.82) 60%, rgba(249,171,0,0.85) 100%)",
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            <div style={{ fontSize: "64px", fontWeight: 800, lineHeight: 1.05 }}>
              {displayName}
            </div>
            <div style={{ fontSize: "30px", opacity: 0.95 }}>
              Public Profile Preview
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                fontSize: "22px",
                fontWeight: 700,
                color: "#E8F1FF",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: "999px",
                padding: "10px 18px",
                background: "rgba(10, 25, 54, 0.55)",
              }}
            >
              Team: {teamBadge}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "#A9D1FF",
            }}
          >
            {gdgId}
          </div>
          <div style={{ fontSize: "24px", opacity: 0.9 }}>
            sparkmates/{gdgId}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
