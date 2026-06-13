"use client";

import * as React from "react";
import Link from "next/link";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
} from "@mui/material";

type Benefit = {
    title: string;
    desc: string;
};

const BENEFITS: Benefit[] = [
    {
        title: "ราคาชัดเจน",
        desc: "แสดงราคารวมก่อนจอง ลดปัญหาค่าใช้จ่ายแอบแฝง",
    },
    {
        title: "รถสภาพดี",
        desc: "ตรวจเช็คและทำความสะอาดก่อนส่งมอบทุกครั้ง",
    },
    {
        title: "ซัพพอร์ต 24/7",
        desc: "มีทีมช่วยเหลือกรณีฉุกเฉินตลอดการเช่า",
    },
];

export default function BenefitsCTASection() {
    const scrollToSearch = () => {
        document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" })
    };

    return (
        <Container maxWidth="lg" className="apple-section pt-0!">
            {/* Benefits */}
            <Box className="apple-shelf mt-1 md:grid md:grid-cols-3">
                {BENEFITS.map((b) => (
                    <Card
                        key={b.title}
                        elevation={0}
                        sx={{ boxShadow: "none" }}
                        className="apple-card group"
                    >
                        <CardContent className="p-5! sm:p-6!">
                            <Box className="min-w-0">
                                <Typography variant="h6" className="text-lg font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
                                    {b.title}
                                </Typography>
                                <Typography className="mt-1 text-sm leading-6 text-[var(--rf-apple-muted)]">
                                    {b.desc}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* CTA */}
            <Box className="apple-card mt-8 overflow-hidden!">
                <Box className="p-5 sm:p-6 md:p-8">
                    <Box className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <Box className="max-w-2xl">
                            <Typography className="apple-card-title-lg font-black tracking-[-0.05em] text-[var(--rf-apple-ink)]">
                                พร้อมจองรถสำหรับทริปถัดไปแล้วใช่ไหม?
                            </Typography>
                            <Typography className="mt-2 text-base text-[var(--rf-apple-muted)]">
                                เลือกช่วงวันและรุ่นรถที่ต้องการ แล้วเริ่มจองได้ทันที
                            </Typography>

                            <Box className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[var(--rf-apple-muted)]">
                                <span className="apple-pill px-3 py-2">
                                    ยกเลิกฟรี (ตามเงื่อนไข)
                                </span>
                                <span className="apple-pill px-3 py-2">
                                    บริการ 24/7
                                </span>
                                <span className="apple-pill px-3 py-2">
                                    รถพร้อมใช้งาน
                                </span>
                            </Box>
                        </Box>

                        <Box className="flex flex-col gap-2 sm:flex-row md:min-w-[232px]">
                            <Button
                                size="large"
                                variant="contained"
                                className="rounded-full! px-6 py-3 font-semibold"
                                component={Link}
                                href="/cars"
                            >
                                ดูรถทั้งหมด
                            </Button>

                            <Button
                                size="large"
                                variant="outlined"
                                className="rounded-full!"
                                onClick={scrollToSearch}
                            >
                                ไปที่ค้นหา
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
