import { ImageResponse } from "next/og";

// Default share image for pages without their own (products set theirs).
// Drawn from text only, using the site's paper, ink and gold colours.
export const alt = "Lion Leather";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f0e8",
          color: "#2a231b",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            paddingLeft: "0.3em",
          }}
        >
          Lion Leather
        </div>
        <div
          style={{
            display: "flex",
            width: 160,
            height: 2,
            background: "#c9a24b",
            marginTop: 40,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: "0.12em",
            color: "#756a5a",
          }}
        >
          Premium leather footwear and accessories
        </div>
      </div>
    ),
    size,
  );
}
