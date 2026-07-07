"use client";

import { Alert, Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import BookingLocation from "./BookingLocation";
import BookingDateTime from "./BookingDateTime";
import BookingAddons from "./BookingAddons";
import type { StorefrontAddon } from "@/src/services/addons/addons.types";

type Props = {
  formId?: string;
  fieldSX: object;
  error: string | null;
  setError: (value: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;

  fullName: string;
  setFullName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;

  merchantBranchesEnabled: boolean;
  branchOptions: string[];
  pickupBranch: string;
  setPickupBranch: (value: string) => void;
  returnBranch: string;
  setReturnBranch: (value: string) => void;
  pickupFreeText: string;
  setPickupFreeText: (value: string) => void;
  returnFreeText: string;
  setReturnFreeText: (value: string) => void;

  pickupDate: string;
  setPickupDate: (value: string) => void;
  pickupTime: string;
  setPickupTime: (value: string) => void;
  returnDate: string;
  setReturnDate: (value: string) => void;
  returnTime: string;
  setReturnTime: (value: string) => void;
  unavailableDates: string[];

  addonOptions: StorefrontAddon[];
  selectedAddonIds: string[];
  addonsTotal: number;
  handleAddonChange: (addonId: string, checked: boolean) => void;

  startDT: Date | null;
  endDT: Date | null;
  timeInvalid: boolean;

  showChatBooking: boolean;
  forceChatBooking: boolean;
  hasChatChannel: boolean;
  chatContactPhone?: string;
  carAvailable: boolean;
  checkingAvailability: boolean;
  availabilityMessage: string | null;
  canSubmit: boolean;
  loading: boolean;
  carExists: boolean;
  chatCopyNotice?: string | null;
  lastChatMessage?: string;
  onCopyChatMessage?: () => void;
  onOpenChat?: () => void;
};

export default function BookingForm({
  formId,
  fieldSX,
  error,
  setError,
  onSubmit,
  fullName,
  setFullName,
  phone,
  setPhone,
  merchantBranchesEnabled,
  branchOptions,
  pickupBranch,
  setPickupBranch,
  returnBranch,
  setReturnBranch,
  pickupFreeText,
  setPickupFreeText,
  returnFreeText,
  setReturnFreeText,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  returnDate,
  setReturnDate,
  returnTime,
  setReturnTime,
  unavailableDates,
  addonOptions,
  selectedAddonIds,
  addonsTotal,
  handleAddonChange,
  startDT,
  endDT,
  timeInvalid,
  showChatBooking,
  forceChatBooking,
  hasChatChannel,
  chatContactPhone,
  carAvailable,
  checkingAvailability,
  availabilityMessage,
  canSubmit,
  loading,
  carExists,
  chatCopyNotice,
  lastChatMessage,
  onCopyChatMessage,
  onOpenChat,
}: Props) {
  const missingRequiredChatChannel = forceChatBooking && !hasChatChannel;
  const chatDetailRows = (lastChatMessage || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) {
        return { label: "", value: line };
      }

      return {
        label: line.slice(0, separatorIndex).trim(),
        value: line.slice(separatorIndex + 1).trim(),
      };
    });

  return (
    <Box id={formId} component="form" onSubmit={onSubmit} className="grid gap-4">
      <Box className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="booking-full-name"
          name="fullName"
          label="ชื่อ-นามสกุล"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          size="small"
          sx={fieldSX}
          inputProps={{ autoComplete: "name" }}
        />
        <TextField
          id="booking-phone"
          name="phone"
          label="เบอร์โทร"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          size="small"
          sx={fieldSX}
          inputProps={{ autoComplete: "tel" }}
        />
      </Box>

      <BookingLocation
        merchantBranchesEnabled={merchantBranchesEnabled}
        branchOptions={branchOptions}
        fieldSX={fieldSX}
        pickupBranch={pickupBranch}
        setPickupBranch={setPickupBranch}
        returnBranch={returnBranch}
        setReturnBranch={setReturnBranch}
        pickupFreeText={pickupFreeText}
        setPickupFreeText={setPickupFreeText}
        returnFreeText={returnFreeText}
        setReturnFreeText={setReturnFreeText}
      />

      <BookingDateTime
        fieldSX={fieldSX}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        returnTime={returnTime}
        setReturnTime={setReturnTime}
        timeInvalid={timeInvalid}
        unavailableDates={unavailableDates}
      />

      <Divider className="border-slate-200!" />

      <BookingAddons
        addonOptions={addonOptions}
        selectedAddonIds={selectedAddonIds}
        addonsTotal={addonsTotal}
        onChange={handleAddonChange}
      />

      {error ? (
        <Alert severity="error" className="mt-1" onClose={() => setError(null)}>
          {error}
        </Alert>
      ) : null}

      {startDT && endDT && endDT.getTime() < startDT.getTime() ? (
        <Alert severity="warning">
          วัน/เวลาคืนรถต้องไม่ก่อนวัน/เวลารับรถ
        </Alert>
      ) : null}

      {availabilityMessage ? (
        <Alert severity="warning">{availabilityMessage}</Alert>
      ) : null}

      {missingRequiredChatChannel ? (
        <Alert severity="warning" className="mt-1">
          {chatContactPhone ? (
            <>
              ร้านนี้ยังไม่ได้ตั้งค่า URL Facebook Page สำหรับเปิด Messenger กรุณาโทรติดต่อร้านที่{" "}
              <Box component="a" href={`tel:${chatContactPhone}`} className="font-bold underline">
                {chatContactPhone}
              </Box>
            </>
          ) : (
            "ร้านนี้ยังไม่ได้ตั้งค่า URL Facebook Page จึงยังไม่สามารถจองผ่านแชทได้"
          )}
        </Alert>
      ) : null}

      {chatCopyNotice ? (
        <Alert
          severity="success"
          className="mt-1"
          sx={{
            alignItems: "flex-start",
            overflowX: "hidden",
            "& .MuiAlert-message": {
              flex: "1 1 auto",
              maxWidth: "100%",
              minWidth: 0,
              overflowX: "hidden",
              width: "auto",
            },
          }}
        >
          <Box className="grid min-w-0 max-w-full gap-3 overflow-hidden">
            <Typography className="text-sm font-bold text-(--rf-apple-ink)">
              ส่งรายละเอียดให้ร้านใน Messenger
            </Typography>
            <Typography className="text-xs font-semibold text-emerald-700">
              {chatCopyNotice}
            </Typography>
            {chatDetailRows.length ? (
              <Box className="grid min-w-0 max-w-full gap-2 overflow-hidden rounded-2xl bg-white/80 p-3 sm:p-4">
                {chatDetailRows.map((row, index) =>
                  row.label ? (
                    <Box
                      key={`${row.label}-${index}`}
                      className="grid min-w-0 max-w-full gap-1 border-b border-black/5 pb-2 last:border-b-0 last:pb-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-3"
                    >
                      <Typography className="min-w-0 text-xs font-bold text-(--rf-apple-muted)">
                        {row.label}
                      </Typography>
                      <Typography className="min-w-0 overflow-hidden text-sm font-semibold break-words text-(--rf-apple-ink)">
                        {row.value || "-"}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      key={`chat-detail-${index}`}
                      className="min-w-0 rounded-xl bg-(--rf-apple-surface-soft) px-3 py-2 text-sm font-bold break-words text-(--rf-apple-ink)"
                    >
                      {row.value}
                    </Typography>
                  )
                )}
              </Box>
            ) : null}
            <Box className="flex min-w-0 max-w-full flex-col gap-3 overflow-hidden sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              {onCopyChatMessage ? (
                <Button
                  variant="outlined"
                  onClick={onCopyChatMessage}
                  className="min-w-0! rounded-xl! px-6! py-3! font-semibold! sm:max-w-full!"
                  sx={{
                    textTransform: "none",
                    borderColor: "var(--rf-apple-border-strong)",
                    color: "var(--rf-apple-ink)",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "var(--rf-apple-border-strong)",
                      backgroundColor: "var(--rf-apple-surface-soft)",
                      boxShadow: "none",
                    },
                  }}
                >
                  คัดลอกอีกครั้ง
                </Button>
              ) : null}
              {onOpenChat ? (
                <Button
                  variant="contained"
                  onClick={onOpenChat}
                  className="min-w-0! rounded-xl! px-6! py-3! font-semibold! sm:max-w-full!"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#059669",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#047857",
                      boxShadow: "none",
                    },
                  }}
                >
                  เปิด Messenger
                </Button>
              ) : null}
            </Box>
          </Box>
        </Alert>
      ) : null}

      {!chatCopyNotice ? (
      <Box className="mt-6 hidden space-y-4 sm:block">
        {showChatBooking ? (
          <Box
            className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
            sx={{
              backgroundImage:
                "radial-gradient(520px 160px at 18% 0%, rgba(251,191,36,0.22), transparent 60%)",
            }}
          >
            <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Box className="min-w-0">
                <Typography className="text-sm font-bold text-amber-900">
                  {forceChatBooking
                    ? "ร้านนี้รับจองผ่านแชทก่อน"
                    : "ยอดรวมค่อนข้างสูง — แนะนำจองผ่านแชท"}
                </Typography>
                <Typography className="mt-1 text-xs text-amber-800">
                  {forceChatBooking
                    ? "ระบบจะบันทึกคำขอจองและคัดลอกสรุปการจองให้ก่อนเปิดแชท"
                    : "ต่อรองราคา/ขอเงื่อนไขพิเศษ หรือประเมินค่าส่งเพิ่มเติมได้"}
                </Typography>
                <Typography className="apple-label-text mt-2 text-amber-700">
                  * เมื่อ Messenger เปิดขึ้น ให้วางข้อความสรุปที่คัดลอกไว้แล้วส่งให้ร้านได้ทันที
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit || loading || checkingAvailability || !carAvailable || !hasChatChannel}
                className="rounded-xl! font-semibold!"
                sx={{
                  textTransform: "none",
                  backgroundColor: "#f59e0b",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#d97706",
                    boxShadow: "none",
                  },
                  minWidth: { sm: 220 },
                  py: 1.25,
                }}
              >
                {loading
                  ? "กำลังเตรียมแชท..."
                  : forceChatBooking
                    ? "จองผ่านแชท"
                    : "จองผ่านแชท (แนะนำ)"}
              </Button>
            </Box>
            {!hasChatChannel ? (
              <Typography className="mt-3 text-xs text-amber-800">
                {chatContactPhone ? (
                  <>
                    ร้านนี้ยังไม่ได้ตั้งค่า URL Facebook Page สำหรับเปิด Messenger กรุณาโทรติดต่อร้านที่{" "}
                    <Box component="a" href={`tel:${chatContactPhone}`} className="font-bold underline">
                      {chatContactPhone}
                    </Box>
                  </>
                ) : (
                  "ร้านนี้ยังไม่ได้ตั้งค่า URL Facebook Page จึงยังไม่สามารถจองผ่านแชทได้"
                )}
              </Typography>
            ) : null}
          </Box>
        ) : null}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          className="items-stretch sm:items-center sm:justify-end"
        >
          <Typography className="text-sm font-bold text-(--rf-apple-ink) sm:pl-1">
            * เลือกข้อมูลให้ถูกต้องก่อนดำเนินการต่อ
          </Typography>

          <Button
            type="submit"
            variant="contained"
            disabled={
              !canSubmit ||
              loading ||
              checkingAvailability ||
              !carAvailable ||
              (forceChatBooking && !hasChatChannel)
            }
            className="rounded-xl! px-6! py-3! font-semibold! sm:min-w-[260px]"
            sx={{
              textTransform: "none",
              backgroundColor: "#059669",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#047857",
                boxShadow: "none",
              },
              "&:disabled": {
                backgroundColor: "#e5e7eb",
                color: "#9ca3af",
                boxShadow: "none",
              },
            }}
          >
            {checkingAvailability
              ? "กำลังตรวจสอบสถานะรถ..."
              : loading
                ? forceChatBooking
                  ? "กำลังส่งคำขอจอง..."
                  : "กำลังไปหน้าชำระเงิน..."
                : forceChatBooking
                  ? "จองผ่านแชท"
                  : "จองและไปชำระเงินทันที"}
          </Button>

        </Stack>
      </Box>
      ) : null}

      {carExists && !carAvailable ? (
        <Alert severity="info">
          รถรุ่นนี้ถูกจองครบแล้ว ไม่สามารถดำเนินการจองเพิ่มได้ในตอนนี้
        </Alert>
      ) : null}

      {!carExists ? (
        <Alert severity="info">
          ยังไม่ได้เลือกรถ — ไปที่หน้า “รถทั้งหมด” เพื่อเลือกคันที่ต้องการ
        </Alert>
      ) : null}
    </Box>
  );
}
