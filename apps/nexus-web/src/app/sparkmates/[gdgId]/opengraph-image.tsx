import { ImageResponse } from 'next/og';
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

import { ASSETS } from "@/lib/constants/assets";

export const runtime = 'edge';

export default async function Image({ params }: { params: Promise<{ gdgId: string }> }) {
  const { gdgId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let name = gdgId;
  let bio = "GDG PUP Sparkmate";
  let fallbackImage = `${baseUrl}${ASSETS.PROFILE.DEFAULT_AVATAR}`;

  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.gdgmembers.gdgId.GET,
      { params: { gdgId } }
    );

    if (result.status === 200 && result.body?.data) {
      const data = result.body.data;
      const fName = data.firstName || '';
      const lName = data.lastName || '';
      name = `${fName} ${lName}`.trim() || data.displayName || gdgId;
      bio = data.bio || bio;
      fallbackImage = data.avatarUrl || fallbackImage;
    }
  } catch(e) {}

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F0E0E',
          color: 'white',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <img
            src={fallbackImage}
            style={{ width: 220, height: 220, borderRadius: 110, border: '6px solid #fff', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: 64, fontWeight: 'bold', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>{name}</h1>
            <p style={{ fontSize: 32, color: '#A0AEC0', margin: 0, maxWidth: '600px' }}>{bio}</p>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 80, alignSelf: 'flex-start', color: '#718096', fontSize: 24, fontWeight: 'bold' }}>
          GDG PUP Nexus Profile
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
