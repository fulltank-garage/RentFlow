"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { formatTHB } from "@/src/constants/money";
import { useRentFlowCarSiteMode } from "@/src/hooks/useRentFlowCarSiteMode";
import { getErrorMessage } from "@/src/lib/api-error";
import { getCarTypeLabel } from "@/src/lib/rentflow-catalog";
import { resolveRentFlowCarAssetUrl } from "@/src/lib/runtime-api-url";
import { aiService } from "@/src/services/ai/ai.service";
import type {
  StorefrontAssistantRecommendation,
  StorefrontAssistantResult,
} from "@/src/services/ai/ai.types";

const SUGGESTIONS = [
  "อยากได้เอสยูวี 5 คน งบไม่เกิน 3000 บาท",
  "ช่วยเลือกรถสำหรับเที่ยวทะเล 4 คน",
  "อยากได้รถประหยัดน้ำมันใช้งานในเมือง",
];

const HIGHLIGHT_TERMS = [
  "ราคา",
  "งบ",
  "ประหยัด",
  "5 ที่นั่ง",
  "ที่นั่ง",
  "เหมาะ",
  "แนะนำ",
  "สาขา",
  "ร้าน",
  "รถ",
];

type AiSummaryItem = {
  label: number;
  text: string;
};

function cleanAiText(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasCarName(value: string) {
  return /\b(Toyota|Honda|Nissan|Mitsubishi|Mazda|Suzuki|Ford|MG|BYD|Isuzu|Hyundai|Kia|BMW|Mercedes|Benz)\b/i.test(
    value
  );
}

function isGenericSummaryIntro(item: AiSummaryItem) {
  if (item.label !== 1) return false;
  if (hasCarName(item.text)) return false;

  return /^(ดังนั้น|สรุป|โดยรวม|เรื่องราว|จากข้อมูล)/.test(item.text);
}

function splitAiSummary(value: string): AiSummaryItem[] {
  const cleaned = cleanAiText(value);
  if (!cleaned) return [];

  const normalized = cleaned
    .replace(/(?:^|\s)(\d+[.)])\s+/g, "\n$1 ")
    .replace(/\s+-\s+/g, "\n- ");

  const rawItems = normalized
    .split(/\n+/)
    .map((part, index) => {
      const trimmed = part.replace(/^[-•]\s*/, "").trim();
      const numbered = trimmed.match(/^(\d+)[.)]\s*(.+)$/);

      return {
        label: numbered ? Number(numbered[1]) : index + 1,
        text: (numbered ? numbered[2] : trimmed).trim(),
      };
    })
    .filter((item) => item.text);

  const items = rawItems.length > 1 ? rawItems : [{ label: 1, text: cleaned }];
  const filteredItems = items.filter((item) => !isGenericSummaryIntro(item));

  return filteredItems.length ? filteredItems : items;
}

function renderHighlightedText(text: string) {
  const pattern = new RegExp(
    `(\\d{1,3}(?:,\\d{3})*\\s*บาท|${HIGHLIGHT_TERMS.map((term) =>
      term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    ).join("|")})`,
    "gi"
  );

  return text.split(pattern).map((part, index) => {
    const isPriceHighlight = /^\d{1,3}(?:,\d{3})*\s*บาท$/i.test(part);
    const isHighlight = HIGHLIGHT_TERMS.some(
      (term) => term.toLocaleLowerCase("th-TH") === part.toLocaleLowerCase("th-TH")
    ) || isPriceHighlight;

    if (!isHighlight) return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;

    return (
      <Box
        key={`${part}-${index}`}
        component="mark"
        className={`font-semibold ${
          isPriceHighlight
            ? "rounded-full bg-(--rf-apple-blue) px-1.5 py-0.5 text-white"
            : "bg-transparent text-(--rf-apple-blue)"
        }`}
      >
        {part}
      </Box>
    );
  });
}

function splitSummaryCarName(text: string) {
  const match = text.match(
    /^((?:Toyota|Honda|Nissan|Mitsubishi|Mazda|Suzuki|Ford|MG|BYD|Isuzu|Hyundai|Kia|BMW|Mercedes|Benz)\b.*?)(?=\s+(?:รองรับ|มี|ราคา|เหมาะ|เป็น|ตรง|และ))/i
  );

  if (!match) {
    return { carName: "", rest: text };
  }

  return {
    carName: match[1].trim(),
    rest: text.slice(match[1].length).trimStart(),
  };
}

function AiSummaryItemText({ text }: { text: string }) {
  const { carName, rest } = splitSummaryCarName(text);

  if (!carName) {
    return <>{renderHighlightedText(text)}</>;
  }

  return (
    <>
      <Box
        component="span"
        className="mr-1 text-[16px] font-extrabold leading-6 text-(--rf-apple-ink)"
      >
        {carName}
      </Box>
      {renderHighlightedText(rest)}
    </>
  );
}

function AiSummaryList({ summary }: { summary: string }) {
  const items = splitAiSummary(summary);

  return (
    <Box className="mt-2 grid gap-2">
      {items.map((item, index) => (
        <Box
          key={`${item.label}-${item.text}-${index}`}
          className="rounded-[18px] bg-white px-3 py-2 text-sm leading-6 text-(--rf-apple-muted)"
        >
          <Box className="flex gap-2">
            <Box className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-(--rf-apple-ink) text-[11px] font-bold text-white">
              {item.label}
            </Box>
            <Typography component="p" className="text-sm leading-6 text-(--rf-apple-muted)">
              <AiSummaryItemText text={item.text} />
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function RecommendationItem({
  car,
  showShopName,
}: {
  car: StorefrontAssistantRecommendation;
  showShopName: boolean;
}) {
  const imageSrc = resolveRentFlowCarAssetUrl(car.image);
  const detailHref = car.domainSlug
    ? `/cars/${encodeURIComponent(car.id)}?tenant=${encodeURIComponent(car.domainSlug)}`
    : `/cars/${encodeURIComponent(car.id)}`;

  return (
    <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-3">
      <Box className="relative h-32 overflow-hidden rounded-[18px] bg-white">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={car.name}
            fill
            unoptimized
            sizes="360px"
            className="object-cover"
          />
        ) : (
          <Box className="grid h-full place-items-center px-2 text-center text-xs font-semibold text-(--rf-apple-muted)">
            ไม่มีรูป
          </Box>
        )}
      </Box>

      <Box className="mt-3 flex min-w-0 flex-col gap-2 pb-2">
        <Box>
          <Typography
            className="text-[15px] font-extrabold! leading-5 text-(--rf-apple-ink)"
            sx={{ fontWeight: 800 }}
          >
            {car.name}
          </Typography>
        </Box>
        <Typography
          component="div"
          className="flex flex-wrap items-center gap-1.5 text-xs text-(--rf-apple-muted)"
        >
          <Box component="span">{car.seats} ที่นั่ง</Box>
          <Box component="span">•</Box>
          <Box component="span">{getCarTypeLabel(car.type)}</Box>
          <Box component="span">•</Box>
          <Box
            component="span"
            className="rounded-full bg-(--rf-apple-blue) px-2.5 py-1 font-extrabold text-white shadow-[0_6px_16px_rgba(88,168,71,0.22)]"
          >
            {formatTHB(car.pricePerDay)}/วัน
          </Box>
        </Typography>
        {showShopName && car.shopName ? (
          <Typography className="w-fit max-w-full truncate rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-(--rf-apple-blue)">
            ร้าน {car.shopName}
          </Typography>
        ) : null}
      </Box>

      <Button
        component={Link}
        href={detailHref}
        size="small"
        fullWidth
        className="mt-5 rounded-full!"
        variant="outlined"
        sx={{ textTransform: "none" }}
      >
        ดูรายละเอียดรถ
      </Button>
    </Box>
  );
}

function AiThinkingState() {
  return (
    <Box className="mt-4 rounded-[22px] bg-(--rf-apple-surface-soft) p-3">
      <Box className="flex items-center gap-3 rounded-[18px] bg-white px-3 py-3">
        <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--rf-apple-ink)">
          <Box className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                sx={{ animationDelay: `${index * 120}ms` }}
              />
            ))}
          </Box>
        </Box>
        <Box className="min-w-0">
          <Typography className="text-sm font-bold text-(--rf-apple-ink)">
            AI กำลังคิดคำตอบ
          </Typography>
          <Typography className="text-xs text-(--rf-apple-muted)">
            กำลังค้นรถที่เหมาะกับเงื่อนไขของคุณ
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function FloatingAiChat() {
  const [open, setOpen] = React.useState(false);
  const [showHint, setShowHint] = React.useState(true);
  const [query, setQuery] = React.useState(SUGGESTIONS[0]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState<StorefrontAssistantResult | null>(
    null
  );
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const siteMode = useRentFlowCarSiteMode();

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowHint(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  const ask = React.useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await aiService.askStorefrontAssistant(trimmed);
      setResult(response);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "ยังไม่สามารถเรียกผู้ช่วย AI ได้"));
    } finally {
      setLoading(false);
    }
  }, [loading, query]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handlePanelWheel = (event: WheelEvent) => {
      const panel = panelRef.current;
      const scrollContainer = scrollContainerRef.current;
      const target = event.target;

      if (
        !panel ||
        !scrollContainer ||
        !(target instanceof Node) ||
        !panel.contains(target)
      ) {
        return;
      }

      const isScrollingUp = event.deltaY < 0;
      const isScrollingDown = event.deltaY > 0;
      const isAtTop = scrollContainer.scrollTop <= 0;
      const isAtBottom =
        Math.ceil(scrollContainer.scrollTop + scrollContainer.clientHeight) >=
        scrollContainer.scrollHeight;

      if (scrollContainer.contains(target)) {
        if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
          event.preventDefault();
          event.stopPropagation();
        }

        return;
      }

      if (target instanceof Element && target.closest("textarea, input, select")) {
        return;
      }

      scrollContainer.scrollBy({
        top: event.deltaY,
        left: event.deltaX,
        behavior: "auto",
      });
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("wheel", handlePanelWheel, {
      capture: true,
      passive: false,
    });

    return () => window.removeEventListener("wheel", handlePanelWheel, true);
  }, [open]);

  return (
    <Box className="fixed bottom-5 right-5 z-50 md:bottom-7 md:right-7">
      <Paper
        ref={panelRef}
        elevation={0}
        className={`absolute bottom-0 right-0 w-[calc(100vw-40px)] max-w-[420px] overflow-hidden rounded-[30px]! border border-black/10 bg-white shadow-(--rf-apple-shadow-soft) transform-gpu will-change-[transform,opacity,filter] transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "pointer-events-auto translate-y-0 scale-[1] opacity-100 blur-0"
            : "pointer-events-none translate-y-3 scale-[0.985] opacity-0 blur-[6px]"
        }`}
        sx={{
          transformOrigin: "bottom right",
          borderColor: "var(--rf-apple-border)",
          boxShadow: "var(--rf-apple-shadow-soft) !important",
        }}
      >
          <Box className="bg-(--rf-apple-ink) px-5 py-4 text-white">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box className="min-w-0 flex-1">
                <Typography className="text-sm font-bold">
                  ผู้ช่วยเลือก RentFlowCar
                </Typography>
                <Typography className="text-xs text-white/65">
                  {siteMode === "marketplace"
                    ? "ช่วยเทียบรถจากหลายร้าน"
                    : "ช่วยเลือกรถจากร้านนี้"}
                </Typography>
              </Box>
              <Button
                aria-label="ปิดผู้ช่วย AI"
                onClick={() => setOpen(false)}
                variant="text"
                className="rounded-full! px-3! py-1.5! text-white! transition-transform duration-300 ease-out hover:scale-105"
                size="small"
              >
                ปิด
              </Button>
            </Stack>
          </Box>

          <Box
            ref={scrollContainerRef}
            className="min-h-[360px] max-h-[70vh] overflow-y-auto overscroll-contain p-5"
            sx={{
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              scrollbarGutter: "stable",
            }}
          >
            <Box className="rounded-[22px] bg-(--rf-apple-surface-soft) p-3">
              <Typography className="text-sm leading-6 text-(--rf-apple-muted)">
                บอกจำนวนคน งบประมาณ หรือสไตล์ทริป แล้ว AI จะช่วยคัดรถที่เหมาะให้
              </Typography>
            </Box>

            <Box className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <Chip
                  key={suggestion}
                  size="small"
                  label={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className={`apple-body-sm h-auto! min-h-11! max-w-full! cursor-pointer justify-start! rounded-[18px]! border px-2! py-2! text-left! font-bold! leading-5! transition-transform duration-1000 ease-[cubic-bezier(0.18,0.9,0.22,1)] hover:scale-[1.006] ${
                    query === suggestion
                      ? "border-(--rf-apple-blue)! bg-(--rf-apple-blue)! text-white!"
                      : "border-black/10! bg-(--rf-apple-surface-soft)! text-(--rf-apple-ink)! hover:bg-white!"
                  }`}
                  sx={{
                    maxWidth: "100%",
                    "& .MuiChip-label": {
                      display: "block",
                      maxWidth: "100%",
                      overflow: "visible",
                      overflowWrap: "anywhere",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    },
                  }}
                />
              ))}
            </Box>

            {loading ? <AiThinkingState /> : null}

            {result ? (
              <Box className="mt-4 rounded-[22px] bg-(--rf-apple-surface-soft) p-3">
                <Typography className="text-sm font-bold text-(--rf-apple-ink)">
                  คำแนะนำ
                </Typography>
                <AiSummaryList summary={result.summary} />

                {result.recommendedCars.length ? (
                  <Box className="mt-3 grid gap-2">
                    {result.recommendedCars.map((car) => (
                      <RecommendationItem
                        key={`${car.id}-${car.domainSlug}`}
                        car={car}
                        showShopName={result.mode === "marketplace"}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography className="mt-3 text-sm text-(--rf-apple-muted)">
                    ยังไม่มีรถที่ตรงกับเงื่อนไขในตอนนี้
                  </Typography>
                )}
              </Box>
            ) : null}

            {error ? (
              <Box className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </Box>
            ) : null}
          </Box>

          <Box className="border-t border-black/10 p-4">
            <Stack direction="row" spacing={1}>
              <Box
                component="textarea"
                id="ai-chat-message"
                name="aiChatMessage"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void ask();
                  }
                }}
                aria-label="พิมพ์สิ่งที่ต้องการถาม AI"
                placeholder="พิมพ์สิ่งที่ต้องการ..."
                rows={1}
                className="min-h-10 max-h-24 w-full resize-none rounded-[18px] border border-black/15 bg-white px-3 py-2 text-sm leading-6 text-(--rf-apple-ink) outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-(--rf-apple-muted) focus:border-(--rf-apple-blue) focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)]"
                sx={{
                  font: "inherit",
                  overflowY: "auto",
                }}
              />
              <Button
                aria-label="ส่งคำถามให้ AI"
                onClick={() => void ask()}
                disabled={loading || !query.trim()}
                variant="contained"
                className="min-w-18! rounded-full! px-4! text-white! transition-transform duration-300 ease-out hover:scale-105 disabled:bg-black/10!"
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "ส่ง"
                )}
              </Button>
            </Stack>
          </Box>
      </Paper>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        className={`will-change-[opacity] transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "pointer-events-none opacity-0"
            : "pointer-events-auto opacity-100"
        }`}
      >
          <Box
            className={`hidden rounded-[20px] border border-black/10 bg-white px-4 py-2 text-right shadow-(--rf-apple-shadow-soft) transition-all duration-500 sm:block ${
              !open && showHint
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-3 opacity-0"
            }`}
          >
            <Typography className="text-sm font-bold text-(--rf-apple-ink)">
              AI ช่วยเลือก
            </Typography>
            <Typography className="text-xs text-(--rf-apple-muted)">
              แนะนำรถให้เหมาะกับทริป
            </Typography>
          </Box>
          <Button
            aria-label="เปิดผู้ช่วย AI"
            onClick={() => setOpen(true)}
            className="h-16! w-16! min-w-16! max-w-16! rounded-full! bg-(--rf-apple-ink)! p-0! text-white! shadow-(--rf-apple-shadow) transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:bg-black!"
            sx={{
              aspectRatio: "1 / 1",
              borderRadius: "9999px !important",
              boxShadow: "var(--rf-apple-shadow)",
              height: "64px !important",
              minWidth: "64px !important",
              padding: "0px !important",
              width: "64px !important",
              "&:hover": {
                boxShadow: "var(--rf-apple-shadow)",
              },
            }}
          >
              <Box
                component="span"
                aria-hidden="true"
                className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full"
              >
                <Image
                  src="/ai-chatbot-icon-transparent.png"
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                  priority={false}
                />
            </Box>
          </Button>
      </Stack>
    </Box>
  );
}
