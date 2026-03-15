# Sparkmates Route Frontend Guide

This guide explains how to implement and maintain the Sparkmates frontend route.

## Route scope

- Frontend page route: /sparkmates/[gdgId]
- Route file: src/app/sparkmates/[gdgId]/page.tsx

## Main API used by this route

GET /api/v1/sparkmates/:gdgId?source=nfc_card|qr_code|direct_link

Response shape:

    {
      "status": "success",
      "message": "Sparkmates profile resolved successfully",
      "data": {
        "gdg_id": "GDGPUP-26-000036",
        "owner_user_id": "47d14d9f-e5b9-4927-8e13-0f7d0bd784e1",
        "source": "nfc_card",
        "status": "issued",
        "portfolio": null
      }
    }

Activated payload example (full portfolio details):

      {
         "status": "success",
         "message": "Sparkmates profile resolved successfully",
         "data": {
            "gdg_id": "GDGPUP-26-000036",
            "owner_user_id": "47d14d9f-e5b9-4927-8e13-0f7d0bd784e1",
            "source": "nfc_card",
            "status": "activated",
            "portfolio": {
               "id": "838868b4-686b-4c02-a975-67eff6835188",
               "user_id": "47d14d9f-e5b9-4927-8e13-0f7d0bd784e1",
               "created_at": "2026-03-15T14:26:48.41934+00:00",
               "updated_at": "2026-03-15T14:26:48.41934+00:00",
               "full_name": null,
               "nickname": "Gerald Berongoy",
               "gdg_id": "GDGPUP-26-000036",
               "membership_type": null,
               "department": null,
               "year_and_program": "3 - BS",
               "bio": "Testing",
               "github_url": "https://www.facebook.com/?_rdc=2&_rdr#",
               "linkedin_url": "https://www.facebook.com/?_rdc=2&_rdr#",
               "portfolio_website_url": "https://www.facebook.com/?_rdc=2&_rdr#",
               "other_links": [],
               "technical_skills": ["many"],
               "learning_interests": [],
               "tools_and_technologies": [],
               "is_public": true
            }
         }
      }

Important fields:

- gdg_id: Profile business identifier used in URL.
- owner_user_id: Supabase auth user id that owns this profile.
- source: Request source context.
- status: issued, activated, suspended, revoked.
- portfolio: Null when hidden or unavailable; otherwise profile payload.
- portfolio.year_and_program, portfolio.department, portfolio.technical_skills, and portfolio.other_links are rendered in the frontend activated view.

## Source behavior rules

Current behavior is source-aware:

- source=nfc_card:
  - Activation gating applies.
  - If status is not activated, frontend should show activation gate UI.
- source=qr_code or source=direct_link:
  - No activation gating from NFC state.
  - Profile can be shown without NFC activation.

## Activation flow for NFC

Use this flow only when source is nfc_card and status is not activated.

1. Determine ownership using ids:
   - isOwner = authUser.id === payload.owner_user_id
2. If isOwner is true, show Activate button.
3. On click, call:
   - POST /api/v1/nfc-system/nfc/:gdgId/activate
   - Authorization: Bearer <token>
4. On success, refetch GET /api/v1/sparkmates/:gdgId?source=nfc_card.

## Why owner_user_id must be used

Do not rely on user metadata gdg_id for ownership checks.

Use auth user id instead:

- Reliable: auth provider always gives user.id for logged-in user.
- Stable: avoids missing metadata edge cases.

## UI state model

Recommended UI states:

- loading
- fetch_error
- activation_gate (NFC only, not activated)
- profile_visible

Minimal decision logic:

1. requiresActivation = payload.source === "nfc_card"
2. showActivationGate = requiresActivation && payload.status !== "activated"
3. isOwner = user.id === payload.owner_user_id

## Common pitfalls

- Showing activation gate for qr_code/direct_link.
- Comparing owner by gdg_id metadata instead of user id.
- Assuming portfolio is always present when status is activated.
- Not refetching after activation.

## Related backend files

- apps/nexus-api/src/v1/routes/sparkmates/sparkmates.controller.ts
- apps/nexus-api/src/v1/modules/sparkmatesModule/useCase/GetSparkmateByGdgIdUseCase.ts
- apps/nexus-api/src/v1/routes/nfc-system/nfcSystem.controller.ts

## Quick QA checklist

1. NFC scan, not owner:
   - See activation gate.
   - No Activate button.
2. NFC scan, owner:
   - See Activate button.
   - After activation, profile appears.
3. QR scan:
   - No activation gate due to NFC state.
   - Profile renders if available.
4. Direct link:
   - Same behavior as QR.
5. Logged out owner case:
   - No Activate button until login.
