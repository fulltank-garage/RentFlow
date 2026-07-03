"use client";

import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { rentFlowSelectMenuProps } from "@/src/components/common/selectMenuProps";

type Props = {
  merchantBranchesEnabled: boolean;
  branchOptions: string[];
  fieldSX: object;
  pickupBranch: string;
  setPickupBranch: (value: string) => void;
  returnBranch: string;
  setReturnBranch: (value: string) => void;
  pickupFreeText: string;
  setPickupFreeText: (value: string) => void;
  returnFreeText: string;
  setReturnFreeText: (value: string) => void;
};

export default function BookingLocation({
  merchantBranchesEnabled,
  branchOptions,
  fieldSX,
  pickupBranch,
  setPickupBranch,
  returnBranch,
  setReturnBranch,
  pickupFreeText,
  setPickupFreeText,
  returnFreeText,
  setReturnFreeText,
}: Props) {
  const floatingSelectLabelClass =
    "pointer-events-none absolute left-3 top-0 z-10 -translate-y-1/2 bg-white px-1 text-[11px] leading-none text-[var(--rf-apple-muted)]";

  return (
    <Box>
      <Typography className="apple-card-title font-semibold text-slate-900">
        จุดรับ-คืนรถ
      </Typography>

      {!merchantBranchesEnabled ? (
        <>
          <Typography className="apple-label-text mt-1 text-slate-500">
            ค่าบริการส่งรถคิดตามระยะทางจริง สามารถประเมินและต่อรองได้ในแชท
          </Typography>

          <Box className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextField
              id="booking-pickup-free-text"
              name="pickupLocation"
              label="สถานที่รับรถ (ไม่บังคับ)"
              value={pickupFreeText}
              onChange={(e) => setPickupFreeText(e.target.value)}
              fullWidth
              size="small"
              sx={fieldSX}
              inputProps={{ autoComplete: "street-address" }}
              helperText={
                pickupFreeText.trim() && pickupFreeText.trim().length < 2
                  ? "อย่างน้อย 2 ตัวอักษร"
                  : " "
              }
              error={
                !!pickupFreeText.trim() && pickupFreeText.trim().length < 2
              }
            />
            <TextField
              id="booking-return-free-text"
              name="returnLocation"
              label="สถานที่คืนรถ (ไม่บังคับ)"
              value={returnFreeText}
              onChange={(e) => setReturnFreeText(e.target.value)}
              fullWidth
              size="small"
              sx={fieldSX}
              inputProps={{ autoComplete: "street-address" }}
              helperText={
                returnFreeText.trim() && returnFreeText.trim().length < 2
                  ? "อย่างน้อย 2 ตัวอักษร"
                  : " "
              }
              error={
                !!returnFreeText.trim() && returnFreeText.trim().length < 2
              }
            />
          </Box>
        </>
      ) : (
        <>
          <Typography className="apple-label-text mt-1 text-slate-500">
            เลือกสาขารับรถและสาขาคืนรถที่ร้านเปิดให้บริการ
          </Typography>

          <Box className="mt-4 grid gap-4 sm:grid-cols-2">
            <Box className="grid gap-3">
              <Box className="relative">
                <Box
                  component="span"
                  id="booking-pickup-branch-label"
                  className={floatingSelectLabelClass}
                >
                  สาขารับรถ
                </Box>
                <TextField
                  select
                  id="booking-pickup-branch"
                  name="pickupBranch"
                  value={pickupBranch}
                  onChange={(e) => setPickupBranch(e.target.value)}
                  fullWidth
                  size="small"
                  SelectProps={{
                    MenuProps: rentFlowSelectMenuProps,
                    SelectDisplayProps: {
                      "aria-labelledby":
                        "booking-pickup-branch-label booking-pickup-branch",
                    },
                    inputProps: {
                      "aria-label": "สาขารับรถ",
                    },
                  }}
                  sx={fieldSX}
                >
                  {branchOptions.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <Box className="grid gap-3">
              <Box className="relative">
                <Box
                  component="span"
                  id="booking-return-branch-label"
                  className={floatingSelectLabelClass}
                >
                  สาขาคืนรถ
                </Box>
                <TextField
                  select
                  id="booking-return-branch"
                  name="returnBranch"
                  value={returnBranch}
                  onChange={(e) => setReturnBranch(e.target.value)}
                  fullWidth
                  size="small"
                  SelectProps={{
                    MenuProps: rentFlowSelectMenuProps,
                    SelectDisplayProps: {
                      "aria-labelledby":
                        "booking-return-branch-label booking-return-branch",
                    },
                    inputProps: {
                      "aria-label": "สาขาคืนรถ",
                    },
                  }}
                  sx={fieldSX}
                >
                  {branchOptions.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
