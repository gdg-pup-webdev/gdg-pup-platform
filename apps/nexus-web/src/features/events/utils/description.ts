export type BoldSegment = {
  text: string;
  bold: boolean;
};

function decodeHtmlEntities(input: string): string {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    return textarea.value;
  }

  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function normalizeEventDescription(input?: string | null): string {
  if (!input) return "";

  let text = input.replace(/\r\n/g, "\n");

  text = text.replace(/<\s*br\s*\/?>/gi, "\n");
  text = text.replace(/<\s*\/p\s*>/gi, "\n\n");
  text = text.replace(/<\s*p[^>]*>/gi, "");
  text = text.replace(/<\s*li[^>]*>/gi, "\n- ");
  text = text.replace(/<\s*\/li\s*>/gi, "");
  text = text.replace(/<\s*\/?(ul|ol)[^>]*>/gi, "\n");
  text = text.replace(/<\s*(strong|b)[^>]*>/gi, "**");
  text = text.replace(/<\s*\/\s*(strong|b)\s*>/gi, "**");
  text = text.replace(/<[^>]+>/g, " ");

  text = decodeHtmlEntities(text);

  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function splitBoldSegments(text: string): BoldSegment[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((segment) => {
      const isBold = segment.startsWith("**") && segment.endsWith("**");
      return {
        text: isBold ? segment.slice(2, -2) : segment,
        bold: isBold,
      };
    });
}

