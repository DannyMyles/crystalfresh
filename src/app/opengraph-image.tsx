import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} – ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const mark = await readFile(join(process.cwd(), "public", site.logo));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0b2540 0%, #0e5488 60%, #0a849b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", padding: 14, borderRadius: 28, background: "#ffffff" }}>
            <img src={markSrc} width={83} height={96} alt="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#399be2", letterSpacing: 1 }}>CRYSTAL FRESH</div>
            <div style={{ fontSize: 20, letterSpacing: 6, color: "#d7ecfa", marginTop: 6 }}>PURE DRINKING WATER</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>{site.tagline}</div>
          <div style={{ fontSize: 28, marginTop: 24, color: "#b2daf5" }}>
            Bottled drinking water & water refill services · Ndwaru Road, Kenya
          </div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#d7ecfa" }}>
          <div>{`Call / WhatsApp ${site.phone.display}`}</div>
          <div>{site.email}</div>
        </div>
      </div>
    ),
    size,
  );
}
