"use client";

import * as React from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import { formatTHB } from "@/src/constants/money";
import { formatBookingDateTime } from "@/src/lib/booking-datetime";
import { readClientCookie, writeClientCookie } from "@/src/lib/client-cookie";

type Props = {
  bookingId: string;
  amount: number;
  customerName?: string;
  customerPhone?: string;
  carName?: string;
  pickupDate?: string;
  returnDate?: string;
  pickupPoint?: string;
  returnPoint?: string;
  shopName?: string;
};

type PreviewField = {
  label: string;
  value: string;
  wide?: boolean;
  emphasized?: boolean;
};

type DownloadMode = "auto" | "manual";
type DownloadStatus = "idle" | "auto" | "manual" | "error";

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const value = (text || "-").trim() || "-";
  const lines: string[] = [];
  let current = "";

  for (const char of value) {
    const next = `${current}${char}`;
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current);
      current = char;
      continue;
    }

    current = next;
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : ["-"];
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height
  );
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function measureCanvasCardHeight({
  ctx,
  width,
  value,
  fontFamily,
  valueFontSize = 34,
  minHeight = 118,
}: {
  ctx: CanvasRenderingContext2D;
  width: number;
  value: string;
  fontFamily: string;
  valueFontSize?: number;
  minHeight?: number;
}) {
  ctx.font = `700 ${valueFontSize}px ${fontFamily}`;
  const valueLines = wrapCanvasText(ctx, value, width - 64);
  const contentHeight = 38 + valueLines.length * (valueFontSize + 12);
  return Math.max(minHeight, contentHeight + 48);
}

function drawCanvasCard({
  ctx,
  x,
  y,
  width,
  label,
  value,
  fontFamily,
  background = "#ffffff",
  labelColor = "#64748b",
  valueColor = "#0f172a",
  valueFontSize = 34,
  minHeight = 118,
}: {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  label: string;
  value: string;
  fontFamily: string;
  background?: string;
  labelColor?: string;
  valueColor?: string;
  valueFontSize?: number;
  minHeight?: number;
}) {
  const height = measureCanvasCardHeight({
    ctx,
    width,
    value,
    fontFamily,
    valueFontSize,
    minHeight,
  });
  ctx.font = `700 ${valueFontSize}px ${fontFamily}`;
  const valueLines = wrapCanvasText(ctx, value, width - 64);

  drawRoundedRect(ctx, x, y, width, height, 30);
  ctx.fillStyle = background;
  ctx.fill();

  ctx.textBaseline = "top";
  ctx.fillStyle = labelColor;
  ctx.font = `700 24px ${fontFamily}`;
  ctx.fillText(label, x + 32, y + 28);

  ctx.fillStyle = valueColor;
  ctx.font = `700 ${valueFontSize}px ${fontFamily}`;
  valueLines.forEach((line, lineIndex) => {
    ctx.fillText(line, x + 32, y + 70 + lineIndex * (valueFontSize + 12));
  });

  return height;
}

async function waitForCanvasFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return;
  }

  try {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => window.setTimeout(resolve, 1500)),
    ]);
  } catch {
    // Ignore font-loading failures and continue with fallback fonts.
  }
}

async function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string) {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png", 1);
  });

  const href = blob ? URL.createObjectURL(blob) : canvas.toDataURL("image/png");
  const link = document.createElement("a");

  link.href = href;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (blob) {
    window.setTimeout(() => URL.revokeObjectURL(href), 1_000);
  }
}

function ReceiptPreviewSection({
  title,
  fields,
}: {
  title: string;
  fields: PreviewField[];
}) {
  return (
    <Box className="rounded-[30px] border border-black/10 bg-[#f8fafc] p-4 shadow-(--rf-apple-shadow-soft) md:p-5">
      <Typography className="apple-card-title font-bold tracking-[-0.03em] text-(--rf-apple-ink)">
        {title}
      </Typography>

      <Box className="mt-4 grid grid-cols-12 gap-3">
        {fields.map((field) => (
          <Box
            key={`${title}-${field.label}`}
            className={`${field.wide ? "col-span-12" : "col-span-12 sm:col-span-6"} rounded-3xl border border-black/10 bg-white px-4 py-4 shadow-(--rf-apple-shadow-soft)`}
          >
            <Typography className="apple-label-text font-bold uppercase text-(--rf-apple-muted)">
              {field.label}
            </Typography>
            <Typography
              className={`mt-2 wrap-break-word leading-7 text-(--rf-apple-ink) ${field.emphasized ? "text-lg font-black tracking-[-0.03em]" : "text-base font-bold"}`}
            >
              {field.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function BookingReceiptCard({
  bookingId,
  amount,
  customerName,
  customerPhone,
  carName,
  pickupDate,
  returnDate,
  pickupPoint,
  returnPoint,
  shopName,
}: Props) {
  const [downloading, setDownloading] = React.useState(false);
  const [downloadStatus, setDownloadStatus] = React.useState<DownloadStatus>("idle");
  const autoDownloadStartedRef = React.useRef(false);

  const issuedDate = React.useMemo(
    () =>
      new Intl.DateTimeFormat("th-TH", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date()),
    []
  );

  const issuedDateShort = React.useMemo(
    () =>
      new Intl.DateTimeFormat("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    []
  );

  const bookingReference = bookingId || "BK-XXXX";
  const filename = `receipt-${bookingReference}.png`;
  const autoDownloadKey = `rentflow-auto-receipt-${bookingReference}`;

  const customerFields = React.useMemo<PreviewField[]>(
    () => [
      {
        label: "ชื่อผู้จอง",
        value: customerName || "-",
        emphasized: true,
      },
      {
        label: "เบอร์โทร",
        value: customerPhone || "-",
      },
    ],
    [customerName, customerPhone]
  );

  const tripFields = React.useMemo<PreviewField[]>(
    () => [
      {
        label: "ร้าน",
        value: shopName || "-",
      },
      {
        label: "รถ",
        value: carName || "-",
        wide: true,
      },
      {
        label: "วันรับรถ",
        value: `${formatBookingDateTime(pickupDate)}${pickupPoint ? ` • ${pickupPoint}` : ""}`,
        wide: true,
      },
      {
        label: "วันคืนรถ",
        value: `${formatBookingDateTime(returnDate)}${returnPoint ? ` • ${returnPoint}` : ""}`,
        wide: true,
      },
    ],
    [carName, pickupDate, pickupPoint, returnDate, returnPoint, shopName]
  );

  const buildReceiptCanvas = React.useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 2280;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }

    const fontFamily =
      '"Roboto", "Noto Sans Thai", sans-serif';
    const pageX = 100;
    const pageY = 80;
    const pageWidth = 1400;
    const pageHeight = 2120;
    const innerX = 170;
    const sectionWidth = 1260;

    ctx.textBaseline = "top";
    ctx.fillStyle = "#eef4f8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const backgroundGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    backgroundGradient.addColorStop(0, "#f8fbff");
    backgroundGradient.addColorStop(1, "#e8f1f8");
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.12)";
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 24;
    drawRoundedRect(ctx, pageX, pageY, pageWidth, pageHeight, 54);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    const headerGradient = ctx.createLinearGradient(pageX, 0, pageX + pageWidth, 360);
    headerGradient.addColorStop(0, "#081425");
    headerGradient.addColorStop(0.58, "#172554");
    headerGradient.addColorStop(1, "#1d4ed8");

    const headerY = 140;
    const headerHeight = 276;
    const headerLeftX = 220;
    const headerContentWidth = 760;
    const headerRightX = 1110;

    drawRoundedRect(ctx, innerX, headerY, sectionWidth, headerHeight, 38);
    ctx.fillStyle = headerGradient;
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `700 26px ${fontFamily}`;
    ctx.fillText("RentFlowCar", headerLeftX, 188);

    ctx.font = `800 64px ${fontFamily}`;
    const titleLines = wrapCanvasText(
      ctx,
      "ใบเสร็จการจอง",
      headerContentWidth
    );
    titleLines.forEach((line, index) => {
      ctx.fillText(line, headerLeftX, 224 + index * 74);
    });

    ctx.font = `500 24px ${fontFamily}`;
    ctx.fillStyle = "rgba(255,255,255,0.76)";
    const subtitleLines = wrapCanvasText(
      ctx,
      shopName ? `ร้าน ${shopName}` : "เอกสารยืนยันการชำระเงินเรียบร้อย",
      headerContentWidth
    );
    subtitleLines.forEach((line, index) => {
      ctx.fillText(line, headerLeftX, 320 + index * 32);
    });

    drawRoundedRect(ctx, headerRightX, 182, 190, 60, 30);
    ctx.fillStyle = "#22c55e";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 26px ${fontFamily}`;
    ctx.fillText("ชำระแล้ว", headerRightX + 48, 197);

    ctx.fillStyle = "rgba(255,255,255,0.64)";
    ctx.font = `700 18px ${fontFamily}`;
    ctx.fillText("วันที่ออกเอกสาร", headerRightX, 278);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 24px ${fontFamily}`;
    const issuedLines = wrapCanvasText(ctx, issuedDateShort, 230);
    issuedLines.forEach((line, index) => {
      ctx.fillText(line, headerRightX, 306 + index * 30);
    });

    let cursorY = 456;

    const bookingCardHeight = drawCanvasCard({
      ctx,
      x: innerX,
      y: cursorY,
      width: 820,
      label: "รหัสการจอง",
      value: bookingReference,
      fontFamily,
      background: "#f8fafc",
      valueFontSize: 34,
      minHeight: 132,
    });

    const totalCardHeight = drawCanvasCard({
      ctx,
      x: innerX + 844,
      y: cursorY,
      width: 416,
      label: "ยอดชำระรวม",
      value: formatTHB(amount),
      fontFamily,
      background: "#ecfdf3",
      labelColor: "#166534",
      valueColor: "#166534",
      valueFontSize: 46,
      minHeight: 132,
    });

    cursorY += Math.max(bookingCardHeight, totalCardHeight) + 20;

    cursorY += drawCanvasCard({
      ctx,
      x: innerX,
      y: cursorY,
      width: sectionWidth,
      label: "วันที่ออกใบเสร็จ",
      value: issuedDate,
      fontFamily,
      background: "#f8fafc",
      valueFontSize: 28,
      minHeight: 118,
    }) + 44;

    ctx.fillStyle = "#0f172a";
    ctx.font = `800 32px ${fontFamily}`;
    ctx.fillText("ข้อมูลผู้จอง", innerX, cursorY);
    cursorY += 52;

    const customerSectionY = cursorY;
    const customerCards = [
      { label: "ชื่อผู้จอง", value: customerName || "-", fontSize: 34 },
      { label: "เบอร์โทร", value: customerPhone || "-", fontSize: 32 },
    ];
    const customerSectionHeight =
      24 +
      customerCards.reduce((total, field) => {
        return (
          total +
          measureCanvasCardHeight({
            ctx,
            width: sectionWidth - 48,
            value: field.value,
            fontFamily,
            valueFontSize: field.fontSize,
            minHeight: 102,
          })
        );
      }, 0) +
      14 * (customerCards.length - 1) +
      24;
    drawRoundedRect(ctx, innerX, customerSectionY, sectionWidth, customerSectionHeight, 34);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();

    let customerCursor = customerSectionY + 24;
    customerCards.forEach((field, index) => {
      customerCursor +=
        drawCanvasCard({
          ctx,
          x: innerX + 24,
          y: customerCursor,
          width: sectionWidth - 48,
          label: field.label,
          value: field.value,
          fontFamily,
          background: "#ffffff",
          valueFontSize: field.fontSize,
          minHeight: 102,
        }) + (index < customerCards.length - 1 ? 14 : 0);
    });

    cursorY = customerSectionY + customerSectionHeight + 46;

    ctx.fillStyle = "#0f172a";
    ctx.font = `800 32px ${fontFamily}`;
    ctx.fillText("รายละเอียดการเช่า", innerX, cursorY);
    cursorY += 52;

    const tripSectionY = cursorY;
    const tripCards = [
      { label: "ร้าน", value: shopName || "-", fontSize: 30 },
      { label: "รถ", value: carName || "-", fontSize: 30 },
      {
        label: "วันรับรถ",
        value: `${formatBookingDateTime(pickupDate)}${pickupPoint ? ` • ${pickupPoint}` : ""}`,
        fontSize: 28,
      },
      {
        label: "วันคืนรถ",
        value: `${formatBookingDateTime(returnDate)}${returnPoint ? ` • ${returnPoint}` : ""}`,
        fontSize: 28,
      },
    ];
    const tripSectionHeight =
      24 +
      tripCards.reduce((total, field) => {
        return (
          total +
          measureCanvasCardHeight({
            ctx,
            width: sectionWidth - 48,
            value: field.value,
            fontFamily,
            valueFontSize: field.fontSize,
            minHeight: 104,
          })
        );
      }, 0) +
      14 * (tripCards.length - 1) +
      24;
    drawRoundedRect(ctx, innerX, tripSectionY, sectionWidth, tripSectionHeight, 34);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();

    let tripCursor = tripSectionY + 24;
    tripCards.forEach((field, index) => {
      tripCursor +=
        drawCanvasCard({
          ctx,
          x: innerX + 24,
          y: tripCursor,
          width: sectionWidth - 48,
          label: field.label,
          value: field.value,
          fontFamily,
          background: "#ffffff",
          valueFontSize: field.fontSize,
          minHeight: 104,
        }) + (index < 3 ? 14 : 0);
    });

    cursorY = tripSectionY + tripSectionHeight + 28;
    drawRoundedRect(ctx, innerX, cursorY, sectionWidth, 132, 30);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();

    ctx.fillStyle = "#166534";
    ctx.font = `700 22px ${fontFamily}`;
    ctx.fillText("ขอบคุณที่ใช้บริการ RentFlowCar", innerX + 30, cursorY + 28);
    ctx.fillStyle = "#64748b";
    ctx.font = `500 19px ${fontFamily}`;
    ctx.fillText(
      "ไฟล์นี้ถูกสร้างอัตโนมัติหลังการจองสำเร็จ เพื่อใช้เก็บอ้างอิงรายการเบื้องต้น",
      innerX + 30,
      cursorY + 62
    );

    return canvas;
  }, [
    amount,
    bookingReference,
    carName,
    customerName,
    customerPhone,
    issuedDate,
    issuedDateShort,
    pickupDate,
    pickupPoint,
    returnDate,
    returnPoint,
    shopName,
  ]);

  const handleDownload = React.useCallback(
    async (mode: DownloadMode = "manual") => {
      if (downloading) {
        return false;
      }

      setDownloading(true);
      setDownloadStatus("idle");

      try {
        await waitForCanvasFonts();
        const canvas = buildReceiptCanvas();
        if (!canvas) {
          setDownloadStatus("error");
          return false;
        }

        await downloadCanvasAsImage(canvas, filename);
        setDownloadStatus(mode);
        return true;
      } catch {
        setDownloadStatus("error");
        return false;
      } finally {
        setDownloading(false);
      }
    },
    [buildReceiptCanvas, downloading, filename]
  );

  React.useEffect(() => {
    if (typeof window === "undefined" || autoDownloadStartedRef.current) {
      return;
    }

    autoDownloadStartedRef.current = true;

    const downloaded = readClientCookie(autoDownloadKey);
    if (downloaded) {
      setDownloadStatus("auto");
      return;
    }

    const timer = window.setTimeout(async () => {
      const success = await handleDownload("auto");
      if (success) {
        writeClientCookie(autoDownloadKey, new Date().toISOString(), {
          maxAge: 60 * 60 * 24,
          sameSite: "Strict",
        });
      }
    }, 520);

    return () => window.clearTimeout(timer);
  }, [autoDownloadKey, handleDownload]);

  const helperText =
    downloadStatus === "error"
      ? "ไม่สามารถสร้างไฟล์ใบเสร็จได้ในครั้งนี้ ลองกดดาวน์โหลดอีกครั้งได้เลย"
      : downloadStatus === "auto"
        ? "ระบบดาวน์โหลดใบเสร็จให้อัตโนมัติแล้ว หากยังไม่ได้รับไฟล์สามารถกดดาวน์โหลดอีกครั้งได้"
        : downloadStatus === "manual"
          ? "ดาวน์โหลดใบเสร็จเรียบร้อยแล้ว สามารถเก็บไฟล์ไว้ใช้อ้างอิงได้ทันที"
          : "เมื่อเข้าหน้านี้ ระบบจะสร้างไฟล์ใบเสร็จให้โดยอัตโนมัติ และยังสามารถกดดาวน์โหลดซ้ำได้ทุกเมื่อ";

  return (
    <Box className="apple-card apple-card-no-hover mt-8 w-full p-5 md:p-6">
      <Box className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Box className="min-w-0">
          <Typography className="text-lg font-bold tracking-[-0.03em] text-(--rf-apple-ink)">
            ใบเสร็จการจอง
          </Typography>
          <Typography className="mt-1 text-sm text-(--rf-apple-muted)">
            ระบบจะดาวน์โหลดไฟล์ให้ทันทีหลังเข้าหน้านี้ และสามารถโหลดซ้ำได้ตลอดเวลา
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => void handleDownload("manual")}
          disabled={downloading}
          className="rounded-full! px-5! font-semibold!"
        >
          {downloading
            ? "กำลังสร้างใบเสร็จ..."
            : downloadStatus === "auto" || downloadStatus === "manual"
              ? "ดาวน์โหลดอีกครั้ง"
              : "ดาวน์โหลดใบเสร็จ"}
        </Button>
      </Box>

      <Box className="mt-4 flex items-center gap-2 text-sm">
        {downloadStatus === "error" ? (
          <Typography className="text-[#dc2626]">{helperText}</Typography>
        ) : (
          <Typography className="text-(--rf-apple-muted)">{helperText}</Typography>
        )}
      </Box>

      <Box className="mt-6 overflow-hidden rounded-[34px] border border-black/10 bg-white shadow-(--rf-apple-shadow-soft)">
        <Box className="bg-[linear-gradient(135deg,#081425_0%,#172554_58%,#1e40af_100%)] px-6 py-6 text-white md:px-8 md:py-8">
          <Box className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <Box className="min-w-0">
              <Typography className="text-sm font-bold tracking-[0.12em] text-white/70">
                RENTFLOW
              </Typography>
              <Typography className="mt-3 text-4xl font-black tracking-[-0.05em] md:text-5xl">
                ใบเสร็จการจอง
              </Typography>
              <Typography className="mt-3 text-base text-white/75 md:text-lg">
                {shopName ? `ร้าน ${shopName}` : "เอกสารยืนยันการชำระเงินเรียบร้อย"}
              </Typography>
            </Box>

            <Box className="flex flex-col items-start gap-3 md:items-end">
              <Chip
                label="ชำระแล้ว"
                className="w-fit bg-emerald-500! font-bold! text-white!"
              />
              <Box className="rounded-[22px] border border-white/14 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <Typography className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                  วันที่ออกใบเสร็จ
                </Typography>
                <Typography className="mt-2 text-base font-bold text-white">
                  {issuedDate}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="space-y-5 px-5 py-5 md:px-8 md:py-8">
          <Box className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
            <Box className="rounded-[28px] border border-black/10 bg-[#f8fafc] p-5 shadow-(--rf-apple-shadow-soft)">
              <Typography className="apple-label-text font-bold uppercase text-(--rf-apple-muted)">
                รหัสการจอง
              </Typography>
              <Typography className="apple-card-title-lg mt-3 break-all font-black tracking-[-0.04em] text-(--rf-apple-ink)">
                {bookingReference}
              </Typography>
            </Box>

            <Box className="rounded-[28px] border border-emerald-200/70 bg-[linear-gradient(180deg,#f0fdf4_0%,#dcfce7_100%)] p-5">
              <Typography className="apple-label-text font-bold uppercase text-emerald-700">
                ยอดชำระรวม
              </Typography>
              <Typography className="apple-price-text mt-3 font-black tracking-[-0.05em] text-emerald-700">
                {formatTHB(amount)}
              </Typography>
            </Box>
          </Box>

          <ReceiptPreviewSection title="ข้อมูลผู้จอง" fields={customerFields} />
          <ReceiptPreviewSection title="รายละเอียดการเช่า" fields={tripFields} />

          <Box className="rounded-[30px] border border-black/10 bg-[#f8fafc] p-4 shadow-(--rf-apple-shadow-soft) md:p-5">
            <Typography className="apple-card-title font-bold tracking-[-0.03em] text-(--rf-apple-ink)">
              หมายเหตุ
            </Typography>
            <Typography className="mt-3 text-sm leading-7 text-(--rf-apple-muted)">
              ใบเสร็จนี้ถูกสร้างให้อัตโนมัติหลังการจองสำเร็จ
              เพื่อใช้เก็บอ้างอิงรายการเบื้องต้น หากต้องการดาวน์โหลดใหม่
              สามารถกดปุ่มด้านบนได้ตลอดเวลา
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
