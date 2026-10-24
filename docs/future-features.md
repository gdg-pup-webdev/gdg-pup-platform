# Future Features

**Source:** [Google Doc, Future Features tab](https://docs.google.com/document/d/1MtkL7wC80pJ0efL8-qb7bjn3P2U8R96av5bigVQy5X4/edit?tab=t.6jeffg32d62)

**Snapshot date:** 2026-10-19. This is a manually maintained copy of the Google Doc draft. The files and Google Doc do not synchronize automatically. Implementation claims and test results retain the assessment date stated below.

**Related:** [Current features](current-features.md) | [Future features](future-features.md) | [Current architecture](current-architecture.md)


GDG PUP Nexus | Unfinished implementation and proposed direction

Assessment date: 2 October 2026

## Two kinds of future work

Continuation work completes or reconnects features already present in the codebase. Proposed additions extend Nexus beyond its current implementation. The priorities below are recommendations, not an approved delivery schedule.

## A. Continue existing implementation

### 1. Complete Sparky Points

Current state: the member page uses fixed sample points, tasks, rewards, and transaction history. Its redemption handler is empty. Persistent wallet and transaction backend code already exists.

Next work: connect the member page to real balances and history, integrate rewards, implement redemption, and verify the full earning-to-spending flow.

### 2. Connect task completion to real points

Current state: the task module uses MockTaskPointsService even though the points module has Supabase repositories.

Next work: replace the mock dependency with the real adapter and verify successful and repeated completion behavior.

### 3. Make leaderboards data-driven

Current state: the leaderboard interface uses hardcoded names, points, and ranking entries.

Next work: define ranking rules, implement backend queries, connect filters and pagination, and show real member rankings.

### 4. Complete event attendance integration

Current state: attendance use cases, contracts, and admin screens exist. The active events router does not expose the attendee endpoints those screens call.

Next work: wire the missing routes and controllers, verify check-in and attendee lists, and test the associated points flow. Physical NFC scanning and an organizer scanner experience need separate verification or implementation.

### 5. Finish GDG Impact, badges, and certificates

Current state: profile Impact and Badges sections show Coming Soon. Achievement and certificate backend modules exist, but they are not registered as active v1 routes.

Next work: agree what each recognition represents, connect the data and APIs, and display actual achievements or contributions.

### 6. Connect product management to the public showcase

Current state: the public product grid imports GDG_PRODUCTS_MOCK. A products CRUD API exists separately.

Next work: connect public product browsing to managed records and confirm the editorial workflow.

### 7. Complete the intended merchandise experience

Current state: the public merch page links to an external Google Form, while inventory and points-redemption code exist in the backend.

Next work: decide the supported ordering and redemption model, then connect the required screens and backend operations. Online checkout is not established as an implemented feature.

### 8. Reconcile older portfolio and identity flows

Current state: older admin portfolio hooks call a v1 portfolios route that is absent from active registration. Older tap/activation flows also target Identity API, which is excluded from the normal development workflow.

Next work: establish the supported member/profile/card model, update callers and documentation, and intentionally retain or retire older paths.

### 9. Complete file-manager folder updates

Current state: the admin file manager explicitly throws an unimplemented error for folder updates.

Next work: implement and connect the update operation.

### 10. Reconcile setup and schema documentation

Current state: some documentation references older versions, route structures, and implementation details. Multiple database snapshots and migrations exist.

Next work: identify the authoritative schema baseline, verify environment-variable requirements, and update affected guidance. Track deferred work in FLAGS.md.

### 11. IoT NFC scanning and event attendance points

Proposed feature: integrate an IoT device with an NFC reader so members can tap their GDG cards at an event to record attendance and receive Sparky Points.

Event flow: an organizer assigns an authorized scanning device to an event. When a member taps a card, the device sends the card identifier and event context to Nexus API. The backend validates the member and event, records the check-in, and awards the event's configured attendance points to the member's wallet.

Award points only after a successful check-in. Repeated taps or retried requests must not create duplicate attendance records or duplicate points awards. The device should show clear feedback for successful, duplicate, and invalid scans.

Implementation dependencies: complete the existing attendance API wiring and connect the device to the persistent points system. Select and validate the hardware and communication protocol during development. This integration is a future feature and has not been implemented or physically verified.

## B. Proposed direction: portfolios and startup building

### Stronger professional portfolios

Build on existing Sparkmates profiles with clearer project roles, contribution evidence, case studies, and useful sharing formats. Connect recognition only after its underlying data is dependable.

### Project collaboration and team formation

Let project owners publish open roles, desired skills, and collaboration opportunities. Allow members to express interest and manage invitations. Existing member discovery can support this direction, but collaboration workflows would be new work.

### Startup profiles and idea validation

Introduce dedicated startup records for the problem, target users, proposed solution, founding team, prototype, and validation evidence. Keep startup profiles distinct from ordinary project records where their needs differ.

### Mentorship workflows

Add mentor profiles, expertise areas, mentorship requests, feedback, and progress tracking. Current mentorship marketing copy does not establish an implemented matching or scheduling system.

### Demo days and pitching

Support submissions, review, project/startup showcases, and pitching opportunities. Define organizer ownership and review rules before implementation.

## Recommended sequence

1. Stabilize existing account, portfolio, project, and NFC flows.
2. Complete attendance, points, task rewards, and real leaderboards.
3. Finish recognition and connect content displays to managed records.
4. Add project collaboration and team formation.
5. Build startup and mentorship workflows after their scope is agreed.

## Presentation wording

Nexus already helps members build and share portfolios. Its proposed next chapter is to help them form teams, turn ideas into products, validate startup opportunities, and showcase their work.

## Main source references

- `apps/nexus-web/src/features/sparky-points/hooks/useSparkyPoints.ts`
- `apps/nexus-web/src/features/sparky-points/components/SparkyPointsSection.tsx`
- `apps/nexus-web/src/features/leaderboard/components/LeaderboardContributors.tsx`
- `apps/nexus-api/src/v1/modules/memberTasks/index.ts`
- `apps/nexus-api/src/v1/routes/events/events.router.ts`
- `apps/nexus-web/src/features/sparkmates/components/sections/BadgesSection.tsx`
- `apps/nexus-web/src/features/sparkmates/components/sections/ImpactSection.tsx`
- `apps/nexus-web/src/features/products/components/products-section/GdgProductsGrid.tsx`
- `apps/nexus-api/src/v1/loaders/loadRoutes.ts`

