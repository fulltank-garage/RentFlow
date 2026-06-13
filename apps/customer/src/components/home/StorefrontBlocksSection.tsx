"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { resolveRentFlowAssetUrl } from "@/src/lib/runtime-api-url";
import type {
  StorefrontBlock,
  StorefrontTheme,
} from "@/src/services/storefront/storefront.types";

type Props = {
  blocks?: StorefrontBlock[];
  theme?: StorefrontTheme;
  builderMode?: boolean;
  onBuilderPatch?: (index: number, patch: Partial<StorefrontBlock>) => void;
  onBuilderAction?: (
    action: "add" | "delete" | "move-up" | "move-down",
    index?: number
  ) => void;
  onBuilderImageUpload?: (index: number, image: BuilderImagePayload) => void;
};

export type BuilderImagePayload = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

function inferImageMimeType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "gif") return "image/gif";
  return "";
}

function readBuilderImageFile(file: File) {
  return new Promise<BuilderImagePayload>((resolve, reject) => {
    const inferredType = file.type || inferImageMimeType(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      let dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        reject(new Error("ไม่สามารถอ่านไฟล์รูปภาพได้"));
        return;
      }

      if (inferredType && dataUrl.startsWith("data:;base64,")) {
        dataUrl = dataUrl.replace("data:;base64,", `data:${inferredType};base64,`);
      }

      if (!dataUrl.startsWith("data:image/")) {
        reject(new Error("รองรับเฉพาะไฟล์รูปภาพเท่านั้น"));
        return;
      }

      resolve({
        name: file.name,
        type: inferredType,
        size: file.size,
        dataUrl,
      });
    };
    reader.onerror = () => reject(new Error("ไม่สามารถอ่านไฟล์รูปภาพได้"));
    reader.readAsDataURL(file);
  });
}

function handleBuilderImageInput(
  event: React.ChangeEvent<HTMLInputElement>,
  index: number,
  onBuilderImageUpload?: (index: number, image: BuilderImagePayload) => void
) {
  const file = event.currentTarget.files?.[0];
  event.currentTarget.value = "";
  if (!file) return;

  void readBuilderImageFile(file).then((image) => {
    onBuilderImageUpload?.(index, image);
  });
}

function getBlockToneStyle(
  tone: StorefrontBlock["tone"],
  theme?: StorefrontTheme
) {
  const primaryColor = theme?.primaryColor || "#2563eb";
  const accentColor = theme?.accentColor || "#0f172a";
  const surfaceColor = theme?.surfaceColor || "#f8fafc";

  if (tone === "highlight") {
    return {
      background:
        surfaceColor === "#ffffff"
          ? "var(--rf-apple-surface)"
          : surfaceColor,
      color: accentColor,
      mutedColor: "var(--rf-apple-muted)",
      buttonColor: primaryColor,
    };
  }

  if (tone === "dark") {
    return {
      background: `linear-gradient(135deg, ${accentColor}, #111827)`,
      color: "#ffffff",
      mutedColor: "rgba(255,255,255,0.72)",
      buttonColor: primaryColor,
    };
  }

  if (tone === "success") {
    return {
      background: "var(--rf-apple-surface)",
      color: "var(--rf-apple-ink)",
      mutedColor: "var(--rf-apple-muted)",
      buttonColor: primaryColor,
    };
  }

  return {
    background: "var(--rf-apple-surface)",
    color: "var(--rf-apple-ink)",
    mutedColor: "var(--rf-apple-muted)",
    buttonColor: primaryColor,
  };
}

function getBlockCardClass(type?: StorefrontBlock["type"]) {
  if (type === "hero") {
    return "rounded-[44px]! bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_34%),linear-gradient(135deg,#0f172a,#111827_46%,#020617)]";
  }
  if (type === "promo" || type === "announcement") {
    return "rounded-[38px]! bg-[linear-gradient(145deg,#fff7ed,#ffffff_58%,#eff6ff)]";
  }
  if (type === "steps") {
    return "rounded-[36px]! bg-[linear-gradient(145deg,#f5f5f7,#ffffff_64%)]";
  }
  if (type === "testimonial") {
    return "rounded-[36px]! bg-[linear-gradient(145deg,#ffffff,#f8fafc)]";
  }
  if (type === "faq") {
    return "rounded-[32px]! bg-[linear-gradient(145deg,#f8fafc,#ffffff)]";
  }
  if (type === "cta") {
    return "rounded-[44px]! bg-[linear-gradient(135deg,#020617,#111827)]";
  }
  return "rounded-[34px]! bg-white";
}

function getBlockBackground(
  type: StorefrontBlock["type"] | undefined,
  fallback: string
) {
  if (type === "promo" || type === "announcement") {
    return "linear-gradient(145deg, #fff7ed, #ffffff 58%, #eff6ff)";
  }
  if (type === "steps") {
    return "linear-gradient(145deg, #f5f5f7, #ffffff 64%)";
  }
  if (type === "testimonial") {
    return "linear-gradient(145deg, #ffffff, #f8fafc)";
  }
  if (type === "faq") {
    return "linear-gradient(145deg, #f8fafc, #ffffff)";
  }
  return fallback;
}

function getBlockLayoutClass(type?: StorefrontBlock["type"]) {
  if (type === "hero") {
    return "md:col-span-2 xl:col-span-3 min-h-[440px] md:min-h-[520px]";
  }
  if (type === "cta") {
    return "md:col-span-2 xl:col-span-3 min-h-[260px]";
  }
  if (type === "promo" || type === "announcement") {
    return "md:col-span-2 min-h-[260px]";
  }
  return "min-h-[220px]";
}

function getBlockContentClass(type?: StorefrontBlock["type"]) {
  if (type === "hero") {
    return "flex h-full flex-col justify-between p-6! sm:p-8! md:p-10! lg:p-12!";
  }
  if (type === "cta") {
    return "flex h-full flex-col justify-between p-7! sm:p-8! md:p-10! lg:p-12!";
  }

  if (type === "promo" || type === "announcement") {
    return "flex h-full flex-col justify-between p-6! sm:p-7! md:p-9!";
  }

  return "flex h-full flex-col justify-between p-5! sm:p-6! md:p-7!";
}

function getImageFrameClass(type?: StorefrontBlock["type"]) {
  if (type === "hero") {
    return "mb-8 rounded-[36px] bg-white/10 p-2";
  }
  if (type === "promo" || type === "announcement") {
    return "mb-6 rounded-[30px] bg-white/70 p-2";
  }
  if (type === "steps") {
    return "mb-6 rounded-[28px] bg-slate-50 p-2";
  }
  if (type === "testimonial") {
    return "mb-6 rounded-[999px] bg-slate-50 p-2";
  }
  return "mb-6 rounded-[28px] bg-white/50 p-2";
}

function getImageAspectClass(type?: StorefrontBlock["type"]) {
  if (type === "hero") return "aspect-[21/9]";
  if (type === "testimonial") return "aspect-[5/2]";
  if (type === "promo" || type === "announcement") return "aspect-[16/8]";
  return "aspect-[16/9]";
}

function getBlockAccent(
  type: StorefrontBlock["type"] | undefined,
  color: string
) {
  if (type === "hero" || type === "cta") {
    return (
      <Box
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
        sx={{ backgroundColor: color }}
      />
    );
  }
  if (type === "promo" || type === "announcement") {
    return (
      <Box className="pointer-events-none absolute right-6 top-6 h-16 w-28 rounded-full bg-blue-100/80" />
    );
  }
  if (type === "steps") {
    return (
      <Box className="pointer-events-none absolute bottom-6 right-6 h-20 w-20 rounded-full bg-blue-100/70" />
    );
  }
  return null;
}

function getTitleClass(type?: StorefrontBlock["type"]) {
  if (type === "hero") {
    return "apple-heading apple-section-title max-w-5xl";
  }
  if (type === "cta") {
    return "apple-heading apple-card-title-lg max-w-4xl";
  }
  return "apple-card-title-lg font-black tracking-[-0.05em]";
}

function getBlockEyebrow(type?: StorefrontBlock["type"]) {
  if (type === "hero") return "ส่วนหลัก";
  if (type === "promo") return "โปรโมชัน";
  if (type === "steps") return "ขั้นตอน";
  if (type === "testimonial") return "รีวิวจากลูกค้า";
  if (type === "faq") return "คำถามที่พบบ่อย";
  if (type === "announcement") return "ประกาศจากร้าน";
  return "";
}

function EditableText({
  value,
  className,
  color,
  multiline = false,
  placeholder,
  onChange,
}: {
  value?: string;
  className?: string;
  color: string;
  multiline?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <Typography
      component="div"
      contentEditable
      suppressContentEditableWarning
      className={`rounded-[14px] outline-2 outline-transparent transition-all focus:bg-white/45 focus:outline-blue-400 ${className || ""}`}
      sx={{
        color,
        minHeight: multiline ? "4.5rem" : undefined,
        whiteSpace: multiline ? "pre-wrap" : undefined,
      }}
      onBlur={(event) => onChange(event.currentTarget.innerText.trim())}
      onKeyDown={(event) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    >
      {value || placeholder}
    </Typography>
  );
}

export default function StorefrontBlocksSection({
  blocks = [],
  theme,
  builderMode = false,
  onBuilderPatch,
  onBuilderAction,
  onBuilderImageUpload,
}: Props) {
  const visibleBlocks = builderMode
    ? blocks
    : blocks.filter((block) => block.title || block.description);
  if (visibleBlocks.length === 0 && !builderMode) return null;

  return (
    <Container maxWidth="lg" className="apple-section pt-0!">
      <Box className="apple-shelf apple-shelf-wide md:grid md:grid-cols-2 xl:grid-cols-3">
        {visibleBlocks.map((block, index) => {
          const isCta = builderMode || block.type === "cta" || block.buttonLabel;
          const toneStyle = getBlockToneStyle(block.tone, theme);
          const isCentered = block.align === "center";
          const eyebrow = block.subtitle || getBlockEyebrow(block.type);
          const imageUrl = resolveRentFlowAssetUrl(block.imageUrl);

          return (
            <Card
              key={block.id || `${block.type || "block"}-${index}`}
              elevation={0}
              sx={{
                boxShadow: "none",
                background: getBlockBackground(block.type, toneStyle.background),
                color: toneStyle.color,
              }}
              className={`apple-card group relative overflow-hidden ${getBlockCardClass(block.type)} ${builderMode ? "ring-2 ring-transparent hover:ring-blue-400" : ""} ${getBlockLayoutClass(block.type)}`}
            >
              {getBlockAccent(block.type, toneStyle.buttonColor)}
              {builderMode ? (
                <Stack
                  direction="row"
                  spacing={1}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-1 shadow-[0_10px_30px_rgba(15,23,42,0.16)] backdrop-blur-xl"
                >
                  <Button
                    size="small"
                    disabled={index === 0}
                    onClick={() => onBuilderAction?.("move-up", index)}
                    className="min-h-8! rounded-full! px-3! text-xs!"
                  >
                    ย้ายขึ้น
                  </Button>
                  <Button
                    size="small"
                    disabled={index === visibleBlocks.length - 1}
                    onClick={() => onBuilderAction?.("move-down", index)}
                    className="min-h-8! rounded-full! px-3! text-xs!"
                  >
                    ย้ายลง
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onBuilderAction?.("delete", index)}
                    className="min-h-8! rounded-full! px-3! text-xs!"
                  >
                    ลบส่วนนี้
                  </Button>
                </Stack>
              ) : null}

              <CardContent
                className={getBlockContentClass(block.type)}
                sx={{
                  textAlign: isCentered ? "center" : "left",
                  alignItems: isCentered ? "center" : "stretch",
                }}
              >
                {imageUrl || builderMode ? (
                  <Box
                    className={`${getImageFrameClass(block.type)} overflow-hidden ${imageUrl ? "" : "border border-dashed border-slate-300"}`}
                  >
                    {imageUrl ? (
                      <Box className={`relative w-full overflow-hidden rounded-[24px] ${getImageAspectClass(block.type)}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={block.imageAlt || block.title || "รูปภาพส่วนเนื้อหา"}
                          className="h-full w-full object-cover"
                        />
                        {builderMode ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            className="absolute bottom-3 right-3 rounded-full bg-white/90 p-1 shadow-[0_10px_30px_rgba(15,23,42,0.16)] backdrop-blur-xl"
                          >
                            <Button
                              component="label"
                              size="small"
                              className="min-h-8! rounded-full! px-3! text-xs!"
                            >
	                              เปลี่ยนรูป
	                              <input
                                  hidden
                                  id={`storefront-block-image-replace-${block.id || index}`}
                                  name={`storefrontBlockImageReplace${index}`}
                                  type="file"
                                  accept="image/png,image/jpeg,image/webp,image/gif"
                                  onChange={(event) =>
                                    handleBuilderImageInput(
                                      event,
                                      index,
                                      onBuilderImageUpload
                                    )
                                  }
                                />
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => onBuilderPatch?.(index, { imageUrl: "" })}
                              className="min-h-8! rounded-full! px-3! text-xs!"
                            >
                              เอารูปออก
                            </Button>
                          </Stack>
                        ) : null}
                      </Box>
                    ) : (
                      <Box className="grid min-h-[190px] place-items-center p-6 text-center">
                        <Box>
                          <Typography className="text-sm font-bold text-slate-600">
                            ยังไม่มีรูปสำหรับส่วนนี้
                          </Typography>
                          <Button
                            component="label"
                            variant="contained"
                            className="mt-3 min-h-10! rounded-full! px-5! text-sm! font-bold!"
                          >
	                            อัปโหลดรูปส่วนนี้
	                            <input
                                hidden
                                id={`storefront-block-image-upload-${block.id || index}`}
                                name={`storefrontBlockImageUpload${index}`}
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={(event) =>
                                  handleBuilderImageInput(
                                    event,
                                    index,
                                    onBuilderImageUpload
                                  )
                                }
                              />
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : null}

                <Box>
                  {eyebrow ? (
                    builderMode ? (
                      <EditableText
                        value={block.subtitle || getBlockEyebrow(block.type)}
                        placeholder="หัวข้อรอง"
                        className="mb-3 text-sm font-bold tracking-[-0.01em]"
                        color={toneStyle.mutedColor}
                        onChange={(value) =>
                          onBuilderPatch?.(index, { subtitle: value })
                        }
                      />
                    ) : (
                      <Typography
                        className="mb-3 text-sm font-bold tracking-[-0.01em]"
                        sx={{ color: toneStyle.mutedColor }}
                      >
                        {eyebrow}
                      </Typography>
                    )
                  ) : null}

                  {builderMode ? (
                    <EditableText
                      value={block.title}
                      placeholder="หัวข้อส่วนเนื้อหา"
                      className={getTitleClass(block.type)}
                      color={toneStyle.color}
                      onChange={(value) => onBuilderPatch?.(index, { title: value })}
                    />
                  ) : (
                    <Typography
                      className={getTitleClass(block.type)}
                      sx={{ color: toneStyle.color }}
                    >
                      {block.title}
                    </Typography>
                  )}

                  {block.description || builderMode ? (
                    builderMode ? (
                      <EditableText
                        value={block.description}
                        placeholder="พิมพ์คำอธิบายของส่วนนี้"
                        multiline
                        className="mt-4 max-w-3xl text-base leading-7"
                        color={toneStyle.mutedColor}
                        onChange={(value) =>
                          onBuilderPatch?.(index, { description: value })
                        }
                      />
                    ) : (
                      <Typography
                        className="mt-4 max-w-3xl text-base leading-7"
                        sx={{ color: toneStyle.mutedColor }}
                      >
                        {block.description}
                      </Typography>
                    )
                  ) : null}
                </Box>

                {isCta && (builderMode || block.href) ? (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.25}
                    className="mt-8"
                    sx={{ alignSelf: isCentered ? "center" : "flex-start" }}
                  >
                    <Button
                      component={builderMode ? "button" : Link}
                      href={builderMode ? undefined : block.href}
                      variant="contained"
                      className="min-h-12! rounded-full! px-7! text-base! font-bold!"
                      sx={{
                        backgroundColor: toneStyle.buttonColor,
                        "&:hover": {
                          backgroundColor: toneStyle.buttonColor,
                          opacity: 0.92,
                        },
                      }}
                    >
                      {builderMode ? (
                        <Box
                          component="span"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(event) =>
                            onBuilderPatch?.(index, {
                              buttonLabel: event.currentTarget.innerText.trim(),
                              href: block.href || "/cars",
                            })
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              event.currentTarget.blur();
                            }
                          }}
                        >
                          {block.buttonLabel || "ดูเพิ่มเติม"}
                        </Box>
                      ) : (
                        block.buttonLabel || "ดูเพิ่มเติม"
                      )}
                    </Button>
                  </Stack>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {builderMode ? (
        <Box className="mt-5 grid place-items-center rounded-[30px] border border-dashed border-blue-300 bg-blue-50/70 p-6">
          <Button
            variant="contained"
            onClick={() => onBuilderAction?.("add")}
            className="min-h-11! rounded-full! px-6! text-sm! font-bold!"
          >
            เพิ่มส่วนเนื้อหา
          </Button>
          <Typography className="mt-2 text-center text-sm text-slate-500">
            คลิกข้อความบนการ์ดเพื่อแก้ไขได้เลย แล้วกดบันทึกที่หน้า Partner
          </Typography>
        </Box>
      ) : null}
    </Container>
  );
}
