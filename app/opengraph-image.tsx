import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Voto Informado Colombia 2026";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          background:
            "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #fef9c3 100%)",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            padding: "12px 32px",
            borderRadius: "9999px",
            border: "1px solid #e5e7eb",
            fontSize: "28px",
            color: "#6b7280",
            marginBottom: "48px",
          }}
        >
          Elecciones Presidenciales Colombia 2026
        </div>

        {/* Headline line 1 */}
        <div
          style={{
            display: "flex",
            fontSize: "96px",
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          <span>Vota con&nbsp;</span>
          <span style={{ color: "#2563eb" }}>información</span>
        </div>

        {/* Headline line 2 */}
        <div
          style={{
            display: "flex",
            fontSize: "96px",
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.1,
            marginBottom: "48px",
          }}
        >
          <span>no con&nbsp;</span>
          <span style={{ color: "#ef4444" }}>polarización</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: "32px",
            color: "#4b5563",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          Descubre cuál candidato presidencial representa mejor tus ideales,
          basado en los programas de gobierno oficiales.
        </div>
      </div>
    ),
    { ...size }
  );
}
