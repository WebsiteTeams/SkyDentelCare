import { ImageResponse } from "next/og";

export const alt = "SkyDentalClinic: premium dental care";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#123B50", color: "#fff", padding: 80 }}>
        <div style={{ fontSize: 34, color: "#EAF7FA" }}>SkyDentalClinic</div>
        <div style={{ fontSize: 84, lineHeight: 1.08, maxWidth: 920 }}>Your Smile Deserves Exceptional Care.</div>
        <div style={{ width: 120, height: 4, background: "#1C9AB7" }} />
      </div>
    ),
    size,
  );
}
