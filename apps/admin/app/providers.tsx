"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const muiColors = {
  primaryNavy: "#011027",
  white: "#fefefe",
  softWhite: "#f9fafb",
};

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: muiColors.softWhite,
      paper: muiColors.white,
    },
    primary: {
      main: muiColors.primaryNavy,
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily:
      "var(--font-english), var(--font-thai), ui-sans-serif, system-ui, sans-serif",
    h1: {
      fontSize: "var(--rf-type-page-title)",
      fontWeight: 800,
      lineHeight: 1.071,
      letterSpacing: "-0.045em",
    },
    h2: {
      fontSize: "var(--rf-type-section-title)",
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: "-0.04em",
    },
    h3: {
      fontSize: "var(--rf-type-card-title)",
      fontWeight: 800,
      lineHeight: 1.143,
      letterSpacing: "-0.03em",
    },
    body1: {
      fontSize: "var(--rf-type-body)",
      lineHeight: 1.47,
    },
    body2: {
      fontSize: "var(--rf-type-body-sm)",
      lineHeight: 1.43,
    },
    button: {
      fontSize: "var(--rf-type-button)",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: muiColors.softWhite,
          fontFamily:
            "var(--font-english), var(--font-thai), ui-sans-serif, system-ui, sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          minHeight: 46,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          minHeight: 46,
        },
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
