"use client";

import * as React from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Skeleton,
    TextField,
    Typography,
} from "@mui/material";

function HeaderSkeleton() {
    return (
        <Box className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Box className="flex flex-col items-center gap-3">
                <Typography className="apple-heading">
                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            width: { xs: 180, md: 260 },
                            height: { xs: 52, md: 72 },
                            borderRadius: "16px",
                            transform: "none",
                        }}
                    />
                </Typography>

                <Typography className="apple-subtitle">
                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            width: { xs: 300, sm: 560 },
                            maxWidth: "100%",
                            height: 28,
                            borderRadius: "12px",
                            transform: "none",
                        }}
                    />
                </Typography>
            </Box>

            <Chip
                size="small"
                variant="outlined"
                label={
                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            width: 42,
                            height: 16,
                            borderRadius: "50px",
                            transform: "none",
                        }}
                    />
                }
                className="apple-pill w-min!"
                sx={{
                    "& .MuiChip-label": {
                        px: 1,
                        display: "flex",
                        alignItems: "center",
                    },
                }}
            />
        </Box>
    );
}

function FilterInputSkeleton() {
    return (
        <Box>
            <TextField
                id="cars-filter-skeleton"
                name="carsFilterSkeleton"
                fullWidth
                size="small"
                label=" "
                disabled
                value=""
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "18px",
                        position: "relative",
                        overflow: "hidden",
                        bgcolor: "transparent",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "transparent",
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            sx={{
                                width: "100%",
                                height: 24,
                                borderRadius: "6px",
                            }}
                        />
                    ),
                }}
            />
        </Box>
    );
}

function CarsFilterBarSkeleton() {
    return (
        <Box className="apple-card apple-card-no-hover mt-8 p-4 sm:p-5">
            <Box className="mb-4 flex flex-col gap-2">
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: 132,
                        height: 24,
                        borderRadius: "8px",
                        transform: "none",
                    }}
                />
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: 360,
                        maxWidth: "100%",
                        height: 18,
                        borderRadius: "8px",
                        transform: "none",
                    }}
                />
            </Box>

            <Box className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(180px,1.15fr)_minmax(150px,0.9fr)_minmax(150px,0.9fr)_minmax(150px,0.85fr)_minmax(150px,0.85fr)_minmax(150px,auto)] xl:items-stretch">
                <FilterInputSkeleton />
                <FilterInputSkeleton />
                <FilterInputSkeleton />
                <FilterInputSkeleton />
                <FilterInputSkeleton />

                <Button
                    variant="outlined"
                    disabled
                    className="rounded-full! xl:w-auto"
                    sx={{
                        height: 40,
                        color: "transparent",
                    }}
                >
                    <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{
                            width: 100,
                            height: 20,
                            borderRadius: "6px",
                            transform: "none",
                        }}
                    />
                </Button>
            </Box>
        </Box>
    );
}

function ShopBoxSkeleton() {
    return (
        <Box className="mt-5 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
            <Box className="flex items-end gap-2">
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: 82,
                        height: 24,
                        borderRadius: "6px",
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: 118,
                        height: 32,
                        borderRadius: "8px",
                        transform: "none",
                    }}
                />
            </Box>
        </Box>
    );
}

function PriceBoxSkeleton() {
    return (
        <Box className="mt-3 rounded-[22px] bg-[var(--rf-apple-surface-soft)] p-4">
            <Box className="flex items-end gap-2">
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: 72,
                        height: 20,
                        borderRadius: "6px",
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: 96,
                        height: 30,
                        borderRadius: "8px",
                        transform: "none",
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: 28,
                        height: 20,
                        borderRadius: "6px",
                        transform: "none",
                    }}
                />
            </Box>
        </Box>
    );
}

function CarCardSkeleton({ showShop = false }: { showShop?: boolean }) {
    return (
        <Card
            elevation={0}
            sx={{ boxShadow: "none" }}
            className="apple-card apple-card-no-hover"
        >
            <Box className="relative h-52 w-full overflow-hidden bg-[var(--rf-apple-surface-soft)] sm:h-56">
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 0,
                    }}
                />
            </Box>

            <CardContent className="p-5! sm:p-6!">
                <Box className="flex items-start justify-between gap-3">
                    <Box className="min-w-0 w-full space-y-2.5">
                        <Typography className="truncate text-lg font-semibold text-slate-900">
                            <Skeleton
                                variant="text"
                                animation="wave"
                                sx={{
                                    width: "68%",
                                    height: 28,
                                    borderRadius: "8px",
                                    transform: "none",
                                }}
                            />
                        </Typography>

                        <Typography className="block text-sm text-slate-600">
                            <Skeleton
                                variant="text"
                                animation="wave"
                                sx={{
                                    mt: 0.5,
                                    width: "88%",
                                    height: 22,
                                    borderRadius: "8px",
                                    transform: "none",
                                }}
                            />
                        </Typography>
                    </Box>
                </Box>

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

export default function CarsPageSkeleton({ showShop = false }: { showShop?: boolean }) {
    return (
        <Box className="apple-page">
            <Container maxWidth="lg" className="apple-section">
                <HeaderSkeleton />
                <CarsFilterBarSkeleton />

                <Box className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <CarCardSkeleton key={index} showShop={showShop} />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
