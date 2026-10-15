"use client";

// Replaces the root layout when it fails, so it renders its own <html> and
// uses inline styles (the app stylesheet and fonts may not be loaded here).
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "0 1.5rem",
          textAlign: "center",
          background: "#f4f0e8",
          color: "#2a231b",
          fontFamily: "Georgia, serif",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "3rem", fontWeight: 400 }}>Oops</h1>
        <p style={{ margin: 0, color: "#756a5a" }}>
          Something went wrong. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            border: "1px solid #985c31",
            background: "#985c31",
            color: "#f4f0e8",
            padding: "0.9rem 2.25rem",
            borderRadius: 5,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        {/* A plain link on purpose: the root layout failed, so reload fully. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/collections" style={{ color: "#985c31", fontSize: "0.9rem" }}>
          Back to shop
        </a>
      </body>
    </html>
  );
}
