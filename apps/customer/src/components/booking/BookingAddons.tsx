"use client";

import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { formatTHB } from "@/src/constants/money";
import type { StorefrontAddon } from "@/src/services/addons/addons.types";

type Props = {
  addonOptions: StorefrontAddon[];
  selectedAddonIds: string[];
  addonsTotal: number;
  onChange: (addonId: string, checked: boolean) => void;
};

export default function BookingAddons({
  addonOptions,
  selectedAddonIds,
  addonsTotal,
  onChange,
}: Props) {
  const selectedIds = new Set(selectedAddonIds);

  return (
    <Box>
      <Typography className="apple-card-title font-semibold text-slate-900">
        บริการเสริม
      </Typography>
      <Typography className="apple-label-text mt-1 text-slate-500">
        เลือกบริการเสริมที่ต้องการ ระบบจะรวมยอดนี้ไว้ในสรุปการจองและยอดชำระ
      </Typography>

      <Box className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {addonOptions.length === 0 ? (
          <Typography className="apple-body-sm text-slate-500">
            ร้านนี้ยังไม่ได้ตั้งค่าบริการเสริมเพิ่มเติม
          </Typography>
        ) : (
          <FormGroup>
            {addonOptions.map((a) => {
            const priceText =
              a.pricing === "perDay"
                ? `${formatTHB(a.price)} / วัน`
                : `${formatTHB(a.price)} / ครั้ง`;

            return (
              <FormControlLabel
                key={a.id}
                control={
                  <Checkbox
                    id={`booking-addon-${a.id}`}
                    name="bookingAddons"
                    checked={selectedIds.has(a.id)}
                    onChange={(e) => onChange(a.id, e.target.checked)}
                  />
                }
                label={
                  <Box className="flex w-full items-start justify-between">
                    <Box>
                      <Typography className="apple-body-sm font-semibold text-slate-900">
                        {a.name}
                      </Typography>
                      <Typography className="apple-label-text text-slate-500">
                        {a.description || "-"}
                      </Typography>
                    </Box>

                    <Typography className="apple-body-sm ml-auto whitespace-nowrap font-bold text-slate-900">
                      {priceText}
                    </Typography>
                  </Box>
                }
                sx={{
                  alignItems: "flex-start",
                  m: 0,
                  py: 0.75,
                  "& .MuiFormControlLabel-label": { width: "100%" },
                }}
              />
            );
            })}
          </FormGroup>
        )}

        <Divider className="my-4! border-slate-200!" />

        <Box className="flex items-center justify-between">
          <Typography className="apple-body-sm text-slate-600">
            มูลค่าบริการเสริมโดยประมาณ
          </Typography>
          <Typography className="apple-body-sm font-bold text-slate-900">
            {addonsTotal > 0 ? formatTHB(addonsTotal) : "-"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
