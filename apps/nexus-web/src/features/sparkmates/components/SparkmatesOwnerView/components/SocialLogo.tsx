"use client";
export function SocialLogo({ type }: { type: "github" | "linkedin" | "website"; }) {
  if (type === "github") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.77-1.33-1.77-1.09-.74.08-.72.08-.72 1.2.08 1.83 1.24 1.83 1.24 1.08 1.83 2.82 1.3 3.51 1 .1-.78.42-1.3.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.19 0 0 1.01-.33 3.3 1.23a11.37 11.37 0 0 1 6 0c2.28-1.56 3.29-1.23 3.29-1.23.66 1.66.25 2.89.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.58A12 12 0 0 0 12 .5z" />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.01 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.83v1.64h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V21h-4v-5.53c0-1.32-.02-3.02-1.84-3.02-1.85 0-2.13 1.45-2.13 2.93V21h-4V9z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M3 12h18M12 3c2.8 2.5 2.8 15.5 0 18M12 3c-2.8 2.5-2.8 15.5 0 18"
        strokeLinecap="round" />
    </svg>
  );
}
