const STARRED_PREFIX = "__sparkmates_starred__::";

export type ParsedCustomButtonLinks = {
  links: string[];
  starredUrls: Set<string>;
};

export function parseCustomButtonLinks(storedLinks: string[] | null | undefined): ParsedCustomButtonLinks {
  const links: string[] = [];
  const starredUrls = new Set<string>();
  const seen = new Set<string>();

  for (const rawEntry of storedLinks ?? []) {
    const entry = rawEntry.trim();
    if (!entry) continue;

    const isStarred = entry.startsWith(STARRED_PREFIX);
    const rawUrl = isStarred ? entry.slice(STARRED_PREFIX.length) : entry;
    const url = rawUrl.trim();

    if (!url || seen.has(url)) {
      if (isStarred && url) starredUrls.add(url);
      continue;
    }

    seen.add(url);
    links.push(url);
    if (isStarred) starredUrls.add(url);
  }

  return { links, starredUrls };
}

export function serializeCustomButtonLinks(links: string[], starredUrls: Set<string>): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const rawUrl of links) {
    const url = rawUrl.trim();
    if (!url || seen.has(url)) continue;

    seen.add(url);
    result.push(starredUrls.has(url) ? `${STARRED_PREFIX}${url}` : url);
  }

  return result;
}
