# Current Features

**Source:** [Google Doc, Current Features tab](https://docs.google.com/document/d/1MtkL7wC80pJ0efL8-qb7bjn3P2U8R96av5bigVQy5X4/edit?tab=t.0)

**Snapshot date:** 2026-10-19. This is a manually maintained copy of the Google Doc draft. The files and Google Doc do not synchronize automatically. Implementation claims and test results retain the assessment date stated below.

**Related:** [Current features](current-features.md) | [Future features](future-features.md) | [Current architecture](current-architecture.md)


GDG PUP Nexus | Project overview and development reference

Assessment date: 2 October 2026

Source baseline: local dev branch, commit 68dd3376, with an existing local change to the typed-rest CLI.

## What is Nexus?

Nexus is GDG on Campus PUP's flagship community platform. It brings together chapter information, member portfolios, project showcases, events, educational resources, and administrative tools. It also gives student contributors practical experience building and maintaining a full-stack application.

Its strongest foundation for the portfolio-building vision is Sparkmates: members can present their identities, skills, links, and project work through editable public profiles.

## How to interpret this document

Implemented means the relevant code and connections were found in the reviewed checkout. It does not mean every browser flow or production integration has been verified. Features with unfinished connections appear in the Future Features tab. Proposed additions are explicitly identified there and are not release commitments.

## Public website and chapter information

- Homepage and chapter introduction.
- About, history, benefits, and partnership pages.
- Team and department information.
- Community showcase, event highlights, and galleries.
- Product showcase interface; its current product list is static and is discussed in the next tab.

## Membership and account access

- Signup restricted to recognized GDG members by email eligibility checking.
- Email OTP verification for account creation.
- Login, logout, token refresh, and session handling.
- Password recovery and password-change flows.
- Email-change flows and account/profile management code.
- Guided onboarding for profile information, images, links, skills, projects, and visibility.

The current main authentication implementation lives in Nexus API. Older authentication and Identity API code also remain in the repository.

## Sparkmates member portfolios

- Public member profiles and an owner editing experience.
- Profile pictures, display names, biographies, and academic information.
- Technical skills, learning interests, tools, and technologies.
- GitHub, LinkedIn, portfolio website, and other links.
- Custom link buttons.
- Profile section ordering, preview, and sharing controls.
- Public/private profile controls.

Badges and GDG Impact currently show Coming Soon content and are not completed member features.

## Member projects

- Create, read, edit, and delete project records.
- Project titles, descriptions, dates, and project links.
- Multiple project images, including adding, deleting, and reordering images.
- Project ordering within a member portfolio.
- Public project lists and project detail pages.

## Networking and member discovery

- Member directory with searching and filters.
- Suggested people based on profile similarities, including skills, interests, and academic information.
- Links to public member portfolios.

This is member discovery. Dedicated connection requests, direct messaging, and startup team formation were not established as implemented workflows in this review.

## NFC portfolio integration

- Card lookup and activation endpoints in Nexus API.
- Owner checks for card activation.
- Profile behavior based on NFC, QR, or direct-link source.
- Card destination management backend support.
- Activation email dispatch code.

Physical NFC behavior was not tested. Older tap and activation routes still use the separate Identity API and need reconciliation with the newer Nexus flows.

## Profile and NFC analytics

- Profile-view and NFC-scan event recording.
- API endpoints backed by Supabase repositories.
- Member analytics page with totals, charts, date filters, and recent activity.

The deployed database and actual event collection were not verified during this review.

## Events and learning

- Event listings, details, filtering, images, and gallery interfaces.
- Registration links to configured event destinations.
- Bevy event data synchronization and RSVP-related synchronization logic.
- Scheduled event synchronization workflows in GitHub Actions.
- Learning resources with links, tags, thumbnails, and team/event associations.
- Team pages displaying study jams and learning resources.

Attendance/check-in has unfinished API wiring and is listed in the next tab.

## Articles and recognition

- Public article lists and article detail views.
- Administrative article creation, editing, and deletion.
- Member showcase records, browsing, and spotlight functionality.

## Organizer administration

A separate admin web application contains management screens for members, teams, articles, member projects, learning resources, showcases, events, Bevy event data, files, roles, and permissions. Some individual operations remain unfinished, including older portfolio administration and folder updates.

## Supporting backend capabilities

- Persistent points wallets and transaction operations.
- Merchandise inventory and redemption business logic.
- File and folder records, uploads, and image processing.
- Supabase and Google Cloud Storage adapters.
- Email service integration, with a mock implementation when mail credentials are absent.
- Role-based access control and API request validation.

These backend capabilities should not be presented as proof that every corresponding member-facing screen is fully integrated.

## Validation evidence

During the repository review on 19 October 2026:

- Nexus API: 248 tests passed across 67 files.
- Spark Tools: 37 tests passed across 3 files.
- Total: 285 passing tests across 70 files.

The API suite includes legacy tests as well as current modules. These results do not establish full feature coverage. A production build, browser walkthrough, live database verification, deployment inspection, and physical NFC testing were not performed.

## Main source references

- docs/state.md and FLAGS.md: operating position and registered limitations.
- apps/nexus-web/src/features: public and member feature implementation.
- apps/nexus-admin-web/src/features: organizer interfaces.
- apps/nexus-api/src/v1/loaders/loadRoutes.ts: active v1 route registration.
- apps/nexus-api/src/v1/modules: use cases, domain entities, and infrastructure.

