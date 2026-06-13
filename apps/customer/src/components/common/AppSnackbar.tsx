"use client";

import * as React from "react";
import { Alert, Snackbar, type AlertColor } from "@mui/material";

export type AppSnackbarSeverity = AlertColor;

type Props = {
  open: boolean;
  message: string;
  severity?: AppSnackbarSeverity;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  autoHideDuration?: number;
};

export default function AppSnackbar({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 3500,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ top: { xs: 12, sm: 16 } }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        elevation={0}
        sx={{
          width: { xs: "calc(100vw - 32px)", sm: 430 },
          minHeight: 48,
          borderRadius: "8px",
          alignItems: "center",
          fontWeight: 600,
          boxShadow:
            "0 12px 30px rgba(15, 23, 42, 0.14), 0 2px 8px rgba(15, 23, 42, 0.08)",
          "& .MuiAlert-icon": {
            mr: 1.25,
          },
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
