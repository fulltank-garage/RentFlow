"use client";

import * as React from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
} from "@mui/material";

export default function AuthCardSkeleton() {
  return (
    <Box className="relative bg-white">
      <Box aria-hidden className="pointer-events-none fixed inset-0" />

      <Container maxWidth="sm" className="relative py-12">
        <Card
          elevation={0}
          className="w-full rounded-2xl! border border-slate-200 bg-white"
          sx={{
            boxShadow: "none",
            backdropFilter: "blur(6px)",
          }}
        >
          <CardContent className="p-8!">
            {/* Logo */}
            <Stack className="mb-6 items-center text-center">
              <Box className="mb-4 flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-1 py-1">
                <Box className="relative h-20 w-20 flex items-center justify-center">
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "14px",
                    }}
                  />
                </Box>
              </Box>
            </Stack>

            {/* Title + Subtitle */}
            <Stack spacing={1} className="mb-4 items-center text-center">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 240,
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
                  width: 320,
                  maxWidth: "100%",
                  height: 22,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Stack>

            <Divider className="my-5! border-slate-200!" />

            <Stack spacing={2} className="items-center">
              <Box
                className="w-full rounded-xl border border-slate-200 bg-white"
                sx={{
                  minHeight: 54,
                  borderRadius: "12px",
                  px: 2.25,
                  py: 1.5,
                }}
              >
                <Box className="flex h-full items-center justify-center gap-3">
                  <Skeleton
                    variant="circular"
                    animation="wave"
                    sx={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                    }}
                  />

                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                      width: 190,
                      maxWidth: "65%",
                      height: 24,
                      borderRadius: "8px",
                      transform: "none",
                    }}
                  />
                </Box>
              </Box>

              {/* Helper text area reserved to prevent layout shift */}
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 155,
                  height: 16,
                  borderRadius: "6px",
                  transform: "none",
                  opacity: 0.7,
                }}
              />
            </Stack>

            {/* Agreement text */}
            <Box className="p-4">
              <Box className="flex flex-col items-center gap-1">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "88%",
                    maxWidth: 360,
                    height: 18,
                    borderRadius: "6px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "78%",
                    maxWidth: 300,
                    height: 18,
                    borderRadius: "6px",
                    transform: "none",
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
