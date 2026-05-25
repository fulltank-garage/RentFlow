"use client";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import RouteLoadingOverlay from "@/src/components/common/RouteLoadingOverlay";

const theme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#ffffff",
            paper: "#ffffff",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#ffffff",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    overflowWrap: "anywhere",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: "var(--rf-type-button-sm)",
                    lineHeight: 1.2,
                },
                sizeSmall: {
                    fontSize: "calc(var(--rf-type-button-sm) - 0.02rem)",
                },
                sizeLarge: {
                    fontSize: "calc(var(--rf-type-button-sm) + 0.08rem)",
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: "var(--rf-type-body)",
                },
                input: {
                    fontSize: "var(--rf-type-body)",
                    lineHeight: 1.5,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: "var(--rf-type-body-sm)",
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: "var(--rf-type-label)",
                    lineHeight: 1.45,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                label: {
                    fontSize: "var(--rf-type-body-sm)",
                    lineHeight: 1.2,
                },
            },
        },
    },
    typography: {
        fontFamily: "var(--font-english), var(--font-thai), system-ui, sans-serif",
        fontSize: 16,
        body1: {
            fontSize: "var(--rf-type-body)",
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
        },
        body2: {
            fontSize: "var(--rf-type-body-sm)",
            lineHeight: 1.55,
            letterSpacing: "-0.01em",
        },
        subtitle1: {
            fontSize: "var(--rf-type-card-title)",
            lineHeight: 1.3,
            fontWeight: 700,
            letterSpacing: "-0.03em",
        },
        subtitle2: {
            fontSize: "var(--rf-type-body-sm)",
            lineHeight: 1.45,
            fontWeight: 600,
            letterSpacing: "-0.02em",
        },
        button: {
            fontSize: "var(--rf-type-button-sm)",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
        },
    },
});

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider options={{ key: "mui" }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <React.Suspense fallback={null}>
                    <RouteLoadingOverlay />
                </React.Suspense>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
