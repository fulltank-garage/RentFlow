import { ImageResponse } from "next/og";

export const alt = "RentFlowCar - เช่ารถง่าย แค่ปลายนิ้ว";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f9fafb",
          color: "#011027",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: "#58a847",
            }}
          />
          RentFlowCar
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              maxWidth: 860,
              fontSize: 82,
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "-0.04em",
            }}
          >
            เช่ารถง่าย แค่ปลายนิ้ว
          </div>
          <div
            style={{
              maxWidth: 820,
              fontSize: 32,
              lineHeight: 1.35,
              color: "#283b55",
            }}
          >
            ค้นหา เปรียบเทียบ และจองรถเช่าออนไลน์กับร้านเช่ารถที่เหมาะกับคุณ
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#4f7f64",
            fontWeight: 700,
          }}
        >
          <span>rentflowcar.xyz</span>
          <span>Car rental marketplace</span>
        </div>
      </div>
    ),
    size
  );
}
