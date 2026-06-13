import type { SelectProps } from "@mui/material/Select";

export const rentFlowSelectMenuProps: NonNullable<SelectProps["MenuProps"]> = {
  disableScrollLock: true,
  slotProps: {
    paper: {
      className: "rentflow-select-menu-paper",
    },
  },
};
