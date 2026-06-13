"use client";

import * as React from "react";
import { Box, Card, CardActions, CardContent, Skeleton, Typography } from "@mui/material";
import type { Car } from "@/src/services/cars/cars.types";
import CarCard from "./CarCard";

type Props = {
    cars: Car[];
    showShop?: boolean;
    loading?: boolean;
};

function ShopBoxSkeleton() {
    return (
        <Box className="mt-5 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
            <Box className="flex flex-wrap items-end gap-x-2 gap-y-1">
                <Skeleton variant="text" animation="wave" sx={{ width: 82, height: 24, borderRadius: "8px", transform: "none" }} />
                <Skeleton variant="text" animation="wave" sx={{ width: 130, height: 30, borderRadius: "8px", transform: "none" }} />
            </Box>
        </Box>
    );
}

function PriceBoxSkeleton() {
    return (
        <Box className="mt-3 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
            <Box className="flex items-end gap-2">
                <Skeleton variant="text" animation="wave" sx={{ width: 74, height: 20, borderRadius: "8px", transform: "none" }} />
                <Skeleton variant="text" animation="wave" sx={{ width: 104, height: 32, borderRadius: "8px", transform: "none" }} />
                <Skeleton variant="text" animation="wave" sx={{ width: 28, height: 20, borderRadius: "8px", transform: "none" }} />
            </Box>
        </Box>
    );
}

function CarGridSkeletonCard({ showShop = false }: { showShop?: boolean }) {
    return (
        <Card elevation={0} className="apple-card apple-card-no-hover">
            <Box className="relative h-52 w-full overflow-hidden bg-[var(--rf-apple-surface-soft)] sm:h-56">
                <Skeleton variant="rectangular" animation="wave" sx={{ width: "100%", height: "100%", borderRadius: 0 }} />
            </Box>
            <CardContent className="p-5! sm:p-6!">
                <Skeleton variant="text" animation="wave" sx={{ width: "68%", height: 28, borderRadius: "8px", transform: "none" }} />
                <Skeleton variant="text" animation="wave" sx={{ mt: 0.5, width: "88%", height: 22, borderRadius: "8px", transform: "none" }} />
                {showShop ? <ShopBoxSkeleton /> : null}
                <PriceBoxSkeleton />
            </CardContent>
            <CardActions
                sx={{ p: { xs: "0px 20px 20px", sm: "0px 16px 16px" } }}
                className="flex-col gap-2 sm:flex-row"
            >
                <Skeleton variant="rounded" animation="wave" sx={{ flex: 1, width: "100%", height: 40, borderRadius: "999px" }} />
                <Skeleton variant="rounded" animation="wave" sx={{ flex: 1, width: "100%", height: 40, borderRadius: "999px" }} />
            </CardActions>
        </Card>
    );
}

export default function CarGrid({ cars, showShop = false, loading = false }: Props) {
    if (loading) {
        return (
            <Box className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: Math.max(cars.length, 6) }).map((_, index) => (
                    <CarGridSkeletonCard key={`car-grid-loading-${index}`} showShop={showShop} />
                ))}
            </Box>
        );
    }

    if (cars.length === 0) {
        return (
            <Box className="mt-8 rounded-[30px] border border-dashed border-black/10 bg-white p-12 text-center">
                <Typography className="text-base font-semibold text-[var(--rf-apple-ink)]">
                    ไม่พบรถที่ตรงกับเงื่อนไข
                </Typography>
                <Typography className="mt-1 text-sm text-[var(--rf-apple-muted)]">
                    ลองเปลี่ยนคำค้นหา หรือเลือกประเภทอื่น
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
                <CarCard key={car.id} car={car} showShop={showShop} />
            ))}
        </Box>
    );
}
