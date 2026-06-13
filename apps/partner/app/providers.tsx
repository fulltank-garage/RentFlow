"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f172a",
    },
    secondary: {
      main: "#2563eb",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#667085",
    },
    success: {
      main: "#22c55e",
    },
    error: {
      main: "#f43f5e",
    },
  },
  typography: {
    fontFamily: "var(--font-english), var(--font-thai), system-ui, sans-serif",
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
    h4: {
      fontSize: "clamp(1.1875rem, 1.02rem + 0.42vw, 1.3125rem)",
      fontWeight: 800,
      lineHeight: 1.19,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontSize: "var(--rf-type-body)",
      fontWeight: 800,
      lineHeight: 1.235,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontSize: "var(--rf-type-body-sm)",
      fontWeight: 700,
      lineHeight: 1.286,
      letterSpacing: "-0.015em",
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
      letterSpacing: "-0.02em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#ffffff",
          fontFamily:
            "var(--font-english), var(--font-thai), system-ui, sans-serif",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "clamp(1rem, 2vw, 1.5rem)",
          paddingRight: "clamp(1rem, 2vw, 1.5rem)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 30,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          minHeight: 46,
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 22,
        },
        input: {
          fontSize: "var(--rf-type-body)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 800,
          minHeight: 46,
          border: 0,
          backgroundColor: "#eef1f5",
          color: "#667085",
        },
        label: {
          paddingLeft: 14,
          paddingRight: 14,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
        },
      },
    },
    MuiAlert: {
      defaultProps: {
        icon: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 20,
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
