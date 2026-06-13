"use client";

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Skeleton,
  Stack,
} from "@mui/material";

type AuthSkeletonLayoutProps = {
  mode: "login" | "register" | "forgot-password";
};

export default function AuthSkeletonLayout({
  mode,
}: AuthSkeletonLayoutProps) {
  const isRegister = mode === "register";
  const isForgotPassword = mode === "forgot-password";

  return (
    <Box className="apple-page relative">
      <Box aria-hidden className="pointer-events-none fixed inset-0" />

      <Container maxWidth="sm" className="apple-section relative">
        <Card
          elevation={0}
          className="apple-card apple-card-no-hover w-full"
          sx={{ backdropFilter: "blur(6px)" }}
        >
          <CardContent className="p-5! sm:p-6! md:p-8!">
            <Stack className="mb-6 items-center text-center">
              <Box className="mb-4 flex items-center justify-center">
                <Box className="flex h-16 w-16 items-center justify-center">
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                    }}
                  />
                </Box>
              </Box>
            </Stack>

            <Stack spacing={1} className="mb-4 items-center text-center">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: isRegister ? 210 : isForgotPassword ? 230 : 180,
                  maxWidth: "100%",
                  height: 38,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: isRegister ? 360 : isForgotPassword ? 380 : 320,
                  maxWidth: "100%",
                  height: 20,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Stack>

            <Divider className="my-5! border-black/10!" />

            <Box className="grid gap-4">
              {isRegister ? (
                <Box className="grid gap-4 sm:grid-cols-2">
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{ width: "100%", height: 56, borderRadius: "18px" }}
                  />
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{ width: "100%", height: 56, borderRadius: "18px" }}
                  />
                </Box>
              ) : null}

              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{ width: "100%", height: 56, borderRadius: "18px" }}
              />

              <Box className="space-y-2.5">
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  sx={{ width: "100%", height: 56, borderRadius: "18px" }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: isRegister || isForgotPassword ? 110 : 28,
                    height: 16,
                    borderRadius: "8px",
                    transform: "none",
                    opacity: 0.85,
                  }}
                />
              </Box>

              {isRegister || isForgotPassword ? (
                <Box className="space-y-2.5">
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{ width: "100%", height: 56, borderRadius: "18px" }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: isForgotPassword ? 92 : 92,
                      height: 16,
                      borderRadius: "8px",
                      transform: "none",
                      opacity: 0.85,
                    }}
                  />
                </Box>
              ) : null}

              {isForgotPassword ? (
                <Box className="space-y-2.5">
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{ width: "100%", height: 56, borderRadius: "18px" }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: 92,
                      height: 16,
                      borderRadius: "8px",
                      transform: "none",
                      opacity: 0.85,
                    }}
                  />
                </Box>
              ) : null}

              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{ width: "100%", height: 52, borderRadius: "999px" }}
              />

              {isForgotPassword || mode === "login" ? (
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: isForgotPassword ? 156 : 190,
                    height: 20,
                    borderRadius: "8px",
                    transform: "none",
                    justifySelf: "center",
                  }}
                />
              ) : null}
            </Box>

            {!isForgotPassword ? (
              <Box className="p-4">
                <Box className="flex flex-col items-center gap-1">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: isRegister ? "92%" : "88%",
                      maxWidth: 380,
                      height: 18,
                      borderRadius: "6px",
                      transform: "none",
                    }}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: isRegister ? "82%" : "74%",
                      maxWidth: 320,
                      height: 18,
                      borderRadius: "6px",
                      transform: "none",
                    }}
                  />
                </Box>
              </Box>
            ) : null}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
