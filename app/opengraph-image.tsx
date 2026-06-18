import { ImageResponse } from "next/og";
import { getSiteDomainLabel } from "@/lib/site";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  const siteDomain = getSiteDomainLabel();
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #dbeafe 0%, #f8fbff 35%, #eef4ff 100%)",
          color: "#14213d",
          fontFamily: "sans-serif",
          padding: 56
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            borderRadius: 36,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.8)",
            padding: 48,
            boxShadow: "0 24px 80px rgba(20,33,61,0.08)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Charlie Smart Travel Search</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 20px",
                borderRadius: 999,
                background: "#edf4ff",
                fontSize: 22,
                color: "#2a5ea7"
              }}
            >
              Alerts ready
            </div>
          </div>

          <div style={{ display: "flex", gap: 36 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
                borderRadius: 32,
                background: "#14213d",
                color: "white",
                padding: 36
              }}
            >
              <div style={{ display: "flex", fontSize: 24, color: "#b7cdf7" }}>Cheap flight tracker</div>
              <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.08 }}>
                No reason to
                <br />
                buy expensive flights.
              </div>
              <div style={{ display: "flex", fontSize: 28, lineHeight: 1.5, color: "#d8e2f3" }}>
                Search links, price logging, history, buy timing, and alert candidates in one place.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 320 }}>
              {[
                ["Tracked routes", "8"],
                ["Saved prices", "11"],
                ["Hot deals", "8"]
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    borderRadius: 28,
                    background: "#f8fafc",
                    padding: 28
                  }}
                >
                  <div style={{ display: "flex", fontSize: 22, color: "#64748b" }}>{label}</div>
                  <div style={{ display: "flex", fontSize: 48, fontWeight: 800 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 24, color: "#5b6b86" }}>
              Shanghai → Fukuoka / Tokyo / Osaka / Seoul / Taipei and more
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "18px 26px",
                borderRadius: 999,
                background: "#14213d",
                color: "white",
                fontSize: 24,
                fontWeight: 700
              }}
            >
              {siteDomain}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
