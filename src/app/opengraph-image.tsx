import { ImageResponse } from "next/og";

export const alt =
  "NeonGulf Launch Prep Kit — Personalized console launch checklist";
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
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #040b12 0%, #0a1a22 55%, #06251f 100%)",
          color: "#e8f4f8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#a5f3fc",
          }}
        >
          NeonGulf · Launch Prep Kit
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Your console night, checklist-ready.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#94a3b8",
              maxWidth: 760,
              lineHeight: 1.35,
            }}
          >
            Five questions → personalized printable prep for PS5 or Xbox.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <span>Free checklist · Print / Save as PDF</span>
          <span>prep.neongulf.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
