"use client";

import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { rentFlowSelectMenuProps } from "@/src/components/common/selectMenuProps";
import { OTHER_OPTION } from "@/src/constants/booking.constants";

type Props = {
  merchantBranchesEnabled: boolean;
  branchOptions: string[];
  fieldSX: object;
  pickupBranch: string;
  setPickupBranch: (value: string) => void;
  returnBranch: string;
  setReturnBranch: (value: string) => void;
  pickupOther: string;
  setPickupOther: (value: string) => void;
  returnOther: string;
  setReturnOther: (value: string) => void;
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
  pickupOther,
  setPickupOther,
  returnOther,
  setReturnOther,
  pickupFreeText,
  setPickupFreeText,
  returnFreeText,
  setReturnFreeText,
}: Props) {
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
            เลือกสาขารับรถ/คืนรถ หรือเลือก “อื่นๆ”
            เพื่อระบุสถานที่สำหรับประเมินค่าส่ง
          </Typography>

          <Box className="mt-4 grid gap-4 sm:grid-cols-2">
            <Box className="grid gap-3">
              <TextField
                select
                id="booking-pickup-branch"
                name="pickupBranch"
                label="สาขารับรถ"
                value={pickupBranch}
                onChange={(e) => setPickupBranch(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ htmlFor: undefined }}
                SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
                sx={fieldSX}
              >
                {branchOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
                <MenuItem value={OTHER_OPTION}>
                  อื่นๆ (ระบุสถานที่เพื่อประเมินค่าส่ง)
                </MenuItem>
              </TextField>

              {pickupBranch === OTHER_OPTION ? (
                <TextField
                  id="booking-pickup-other"
                  name="pickupOther"
                  label="ระบุสถานที่รับรถ"
                  value={pickupOther}
                  onChange={(e) => setPickupOther(e.target.value)}
                  fullWidth
                  size="small"
                  sx={fieldSX}
                  error={
                    pickupOther.trim().length > 0 &&
                    pickupOther.trim().length < 2
                  }
                  helperText={
                    pickupOther.trim().length > 0 &&
                    pickupOther.trim().length < 2
                      ? "อย่างน้อย 2 ตัวอักษร"
                      : " "
                  }
                />
              ) : null}
            </Box>

            <Box className="grid gap-3">
              <TextField
                select
                id="booking-return-branch"
                name="returnBranch"
                label="สาขาคืนรถ"
                value={returnBranch}
                onChange={(e) => setReturnBranch(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ htmlFor: undefined }}
                SelectProps={{ MenuProps: rentFlowSelectMenuProps }}
                sx={fieldSX}
              >
                {branchOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
                <MenuItem value={OTHER_OPTION}>
                  อื่นๆ (ระบุสถานที่เพื่อประเมินค่าส่ง)
                </MenuItem>
              </TextField>

              {returnBranch === OTHER_OPTION ? (
                <TextField
                  id="booking-return-other"
                  name="returnOther"
                  label="ระบุสถานที่คืนรถ"
                  value={returnOther}
                  onChange={(e) => setReturnOther(e.target.value)}
                  fullWidth
                  size="small"
                  sx={fieldSX}
                  error={
                    returnOther.trim().length > 0 &&
                    returnOther.trim().length < 2
                  }
                  helperText={
                    returnOther.trim().length > 0 &&
                    returnOther.trim().length < 2
                      ? "อย่างน้อย 2 ตัวอักษร"
                      : " "
                  }
                />
              ) : null}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
