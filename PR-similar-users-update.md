## Overview

Introduces a member recommendation feature with two explicit endpoints:

- `GET /gdgmembers/:gdgId/similar-users` for relevance-first matching
- `GET /gdgmembers/:gdgId/suggested-users` for broader discovery

Both endpoints now use a wider candidate pool (all members except the source member), and both return a lightweight preview payload (~20% profile fields) for each recommended user.

## What Changed

### API Design

- Removed strategy switching from a single route.
- Split behavior into two clear routes:
  - `similar-users` = relevance-focused recommendations
  - `suggested-users` = broader, discovery-focused recommendations

### Response Shape (Lightweight Preview)

Both routes now return only:

- `gdgId`
- `displayName`
- `avatarUrl`
- `program`
- `department`

This keeps payloads small, supports incomplete profiles, and is ideal for recommendation cards/lists.

### Candidate Pool

- Recommendation pool is now broader:
  - all members except the source member
- This aligns recommendation endpoints more closely with overall member listing volume.

## Algorithm: Weighted Similarity Scoring

The engine remains content-based and computes a weighted score per candidate using profile attributes:

- Program: 22
- Year Level: 18
- Department: 12
- Membership Type: 10
- Technical Skills: 22
- Learning Interests: 8
- Tools & Technologies: 8

Total max score: 100

### Scoring behavior details

- String fields (program/department) support:
  - exact match
  - canonicalized alias/abbreviation match
  - partial token overlap scoring
- Year level supports proximity scoring:
  - same year: full weight
  - near years: partial weight
- Collection fields (skills/interests/tools) use overlap-based scoring.

## Route Behaviors

### 1. Similar Users

`GET /gdgmembers/:gdgId/similar-users?pageNumber=1&pageSize=10`

- Uses relevance filtering (`hasCoreRelevance`) to keep results meaningfully similar.
- Returns ranked similar users with stable pagination metadata.
- Now uses broader pool source, but still enforces relevance anchors.

### 2. Suggested Users

`GET /gdgmembers/:gdgId/suggested-users?pageNumber=1&pageSize=10`

- Discovery-oriented ranking.
- Prioritizes non-similar candidates first, then fills with similar ones.
- Uses aggressive non-similar prioritization ratio (currently `0.9`).

## Why This Split Is Better

- Clear product intent:
  - "Similar" means relevant peers
  - "Suggested" means broader discovery
- No overloaded strategy query to explain to clients.
- Easier to tune each endpoint independently.

## Testing

Updated and expanded tests cover:

- similarity ranking and pagination
- validation and not-found behavior
- strict relevant filtering vs broad exploratory behavior
- broader pool usage
- lightweight response payload mapping in routes

Focused recommendation test suites pass, and build is green.

## Example Calls

```bash
# Relevance-focused
GET /gdgmembers/GDG-1/similar-users?pageNumber=1&pageSize=10

# Discovery-focused
GET /gdgmembers/GDG-1/suggested-users?pageNumber=1&pageSize=10
```

## Notes

- If recommendation counts are still low in a specific environment, that reflects actual available members after excluding the source, not response-shape limits.
- Lightweight payload is intentional and applies to both recommendation routes.
