"use client";

import * as React from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    InputAdornment,
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    RENTFLOW_ROOT_DOMAIN,
    buildStorefrontDomain,
    normalizeDomainSlug,
    readStoreProfile,
    validateDomainSlug,
    writeStoreProfile,
} from "@/src/lib/partner-store";
import { usePartnerRealtimeRefresh } from "@/src/hooks/realtime/usePartnerRealtimeRefresh";
import { RentFlowCarApiError } from "@/src/services/core/api-client.service";
import { tenantService } from "@/src/services/tenant/tenant.service";

export default function StoreSetupPage() {
    const maxPromoImages = 8;
    const bankOptions = [
        "ธนาคารกสิกรไทย",
        "ธนาคารไทยพาณิชย์",
        "ธนาคารกรุงเทพ",
        "ธนาคารกรุงไทย",
        "ธนาคารกรุงศรีอยุธยา",
        "ธนาคารทหารไทยธนชาต",
        "ธนาคารออมสิน",
        "ธนาคารอาคารสงเคราะห์",
    ];
    const [shopName, setShopName] = React.useState("");
    const [domainSlug, setDomainSlug] = React.useState("");
    const [logoUrl, setLogoUrl] = React.useState("");
    const [promoImageUrls, setPromoImageUrls] = React.useState<string[]>([]);
    const [contactPhone, setContactPhone] = React.useState("");
    const [promptPayId, setPromptPayId] = React.useState("");
    const [promptPayType, setPromptPayType] = React.useState("phone");
    const [bankName, setBankName] = React.useState("");
    const [bankAccountName, setBankAccountName] = React.useState("");
    const [bankAccountNumber, setBankAccountNumber] = React.useState("");
    const [facebookPageUrl, setFacebookPageUrl] = React.useState("");
    const [logoFile, setLogoFile] = React.useState<File | null>(null);
    const [promoImageFiles, setPromoImageFiles] = React.useState<File[]>([]);
    const [logoChanged, setLogoChanged] = React.useState(false);
    const [promoImagesChanged, setPromoImagesChanged] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState(
        "กรุณากรอกชื่อร้านและชื่อโดเมนให้ถูกต้อง"
    );
    const [saving, setSaving] = React.useState(false);
    const [reloadTick, setReloadTick] = React.useState(0);

    usePartnerRealtimeRefresh({
        events: ["tenant.updated"],
        onRefresh: React.useCallback(() => {
            setReloadTick((current) => current + 1);
        }, []),
    });

    React.useEffect(() => {
        let active = true;
        const profile = readStoreProfile();
        if (profile) {
            setShopName(profile.shopName);
            setDomainSlug(profile.domainSlug);
            setLogoUrl(profile.logoUrl || "");
            setPromoImageUrls(profile.promoImageUrls?.length ? profile.promoImageUrls : profile.promoImageUrl ? [profile.promoImageUrl] : []);
            setContactPhone(profile.contactPhone || "");
            setPromptPayId(profile.promptPayId || "");
            setPromptPayType(profile.promptPayType || "phone");
            setBankName(profile.bankName || "");
            setBankAccountName(profile.bankAccountName || "");
            setBankAccountNumber(profile.bankAccountNumber || "");
            setFacebookPageUrl(profile.facebookPageUrl || "");
        }

        tenantService
            .getMyTenant({ force: true })
            .then((tenant) => {
                if (!active) return;
                writeStoreProfile({
                    tenantId: tenant.id,
                    shopName: tenant.shopName,
                    domainSlug: tenant.domainSlug,
                    storefrontDomain: tenant.publicDomain,
                    ownerEmail: tenant.ownerEmail,
                    status: tenant.status,
                    plan: tenant.plan,
                    logoUrl: tenant.logoUrl || profile?.logoUrl,
                    promoImageUrl: tenant.promoImageUrl || profile?.promoImageUrl,
                    promoImageUrls: tenant.promoImageUrls?.length ? tenant.promoImageUrls : profile?.promoImageUrls,
                    contactPhone: tenant.contactPhone || profile?.contactPhone || "",
                    promptPayId: tenant.promptPayId || profile?.promptPayId || "",
                    promptPayType: tenant.promptPayType || profile?.promptPayType || "phone",
                    bankName: tenant.bankName || profile?.bankName || "",
                    bankAccountName: tenant.bankAccountName || profile?.bankAccountName || "",
                    bankAccountNumber: tenant.bankAccountNumber || profile?.bankAccountNumber || "",
                    facebookPageUrl: tenant.facebookPageUrl || profile?.facebookPageUrl || "",
                    createdAt: tenant.createdAt,
                    updatedAt: tenant.updatedAt,
                });
                setShopName(tenant.shopName);
                setDomainSlug(tenant.domainSlug);
                setLogoUrl(tenant.logoUrl || profile?.logoUrl || "");
                setPromoImageUrls(
                    tenant.promoImageUrls?.length
                        ? tenant.promoImageUrls
                        : tenant.promoImageUrl
                          ? [tenant.promoImageUrl]
                          : profile?.promoImageUrls?.length
                            ? profile.promoImageUrls
                            : profile?.promoImageUrl
                              ? [profile.promoImageUrl]
                              : []
                );
                setContactPhone(tenant.contactPhone || profile?.contactPhone || "");
                setPromptPayId(tenant.promptPayId || profile?.promptPayId || "");
                setPromptPayType(tenant.promptPayType || profile?.promptPayType || "phone");
                setBankName(tenant.bankName || profile?.bankName || "");
                setBankAccountName(tenant.bankAccountName || profile?.bankAccountName || "");
                setBankAccountNumber(tenant.bankAccountNumber || profile?.bankAccountNumber || "");
                setFacebookPageUrl(tenant.facebookPageUrl || profile?.facebookPageUrl || "");
                setLogoFile(null);
                setPromoImageFiles([]);
                setLogoChanged(false);
                setPromoImagesChanged(false);
            })
            .catch((error: unknown) => {
                if (
                    error instanceof RentFlowCarApiError &&
                    error.status === 404
                ) {
                    return;
                }
                if (!active) return;
                setSnackbarMessage(
                    error instanceof Error
                        ? error.message
                        : "ไม่สามารถดึงข้อมูลร้านได้"
                );
                setSnackbarOpen(true);
            });

        return () => {
            active = false;
        };
    }, [reloadTick]);

    const normalizedSlug = normalizeDomainSlug(domainSlug);
    const domainError = domainSlug ? validateDomainSlug(normalizedSlug) : "";
    const shopError =
        shopName.trim().length > 0 && shopName.trim().length < 2
            ? "ชื่อร้านต้องมีอย่างน้อย 2 ตัวอักษร"
            : "";
    const storefrontDomain = normalizedSlug
        ? buildStorefrontDomain(normalizedSlug)
        : `ชื่อร้าน.${RENTFLOW_ROOT_DOMAIN}`;
    const canSubmit =
        shopName.trim().length >= 2 &&
        normalizedSlug.length > 0 &&
        !domainError &&
        !saving;

    function readImageFile(
        event: React.ChangeEvent<HTMLInputElement>,
        options: {
            maxSize: number;
            maxSizeLabel: string;
            onLoad: (value: string, file: File) => void;
        }
    ) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setSnackbarMessage("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            setSnackbarOpen(true);
            return;
        }

        if (file.size > options.maxSize) {
            setSnackbarMessage(`ไฟล์รูปภาพควรมีขนาดไม่เกิน ${options.maxSizeLabel}`);
            setSnackbarOpen(true);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                options.onLoad(reader.result, file);
            }
        };
        reader.onerror = () => {
            setSnackbarMessage("ไม่สามารถอ่านไฟล์โลโก้ได้");
            setSnackbarOpen(true);
        };
        reader.readAsDataURL(file);
    }

    function readImageFiles(
        event: React.ChangeEvent<HTMLInputElement>,
        options: {
            maxSize: number;
            maxSizeLabel: string;
            maxFiles: number;
            onLoad: (values: string[], files: File[]) => void;
        }
    ) {
        const files = Array.from(event.target.files || []);
        event.target.value = "";
        if (!files.length) return;

        if (files.length > options.maxFiles) {
            setSnackbarMessage(`เลือกรูปได้ไม่เกิน ${options.maxFiles} รูปต่อครั้ง`);
            setSnackbarOpen(true);
            return;
        }

        const invalidFile = files.find((file) => !file.type.startsWith("image/"));
        if (invalidFile) {
            setSnackbarMessage("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            setSnackbarOpen(true);
            return;
        }

        const oversizeFile = files.find((file) => file.size > options.maxSize);
        if (oversizeFile) {
            setSnackbarMessage(`ไฟล์รูปภาพแต่ละรูปควรมีขนาดไม่เกิน ${options.maxSizeLabel}`);
            setSnackbarOpen(true);
            return;
        }

        Promise.all(
            files.map(
                (file) =>
                    new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (typeof reader.result === "string") {
                                resolve(reader.result);
                                return;
                            }
                            reject(new Error("ไม่สามารถอ่านไฟล์รูปภาพได้"));
                        };
                        reader.onerror = () => reject(new Error("ไม่สามารถอ่านไฟล์รูปภาพได้"));
                        reader.readAsDataURL(file);
                    })
            )
        )
            .then((values) => options.onLoad(values, files))
            .catch((error: unknown) => {
                setSnackbarMessage(
                    error instanceof Error ? error.message : "ไม่สามารถอ่านไฟล์รูปภาพได้"
                );
                setSnackbarOpen(true);
            });
    }

    function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
        readImageFile(event, {
            maxSize: 5 * 1024 * 1024,
            maxSizeLabel: "5 เมกะไบต์",
            onLoad: (value, file) => {
                setLogoUrl(value);
                setLogoFile(file);
                setLogoChanged(true);
            },
        });
    }

    function handlePromoImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
        readImageFiles(event, {
            maxSize: 5 * 1024 * 1024,
            maxSizeLabel: "5 เมกะไบต์",
            maxFiles: maxPromoImages,
            onLoad: (values, files) => {
                const remainingSlots = Math.max(maxPromoImages - promoImageUrls.length, 0);
                if (remainingSlots <= 0) {
                    setSnackbarMessage(`เก็บรูปโปรโมชันได้สูงสุด ${maxPromoImages} รูป`);
                    setSnackbarOpen(true);
                    return;
                }
                if (values.length > remainingSlots) {
                    setSnackbarMessage(`เพิ่มได้อีก ${remainingSlots} รูปเท่านั้น`);
                    setSnackbarOpen(true);
                }
                setPromoImageUrls((current) => [
                    ...current,
                    ...values.slice(0, remainingSlots),
                ]);
                setPromoImageFiles((current) => [
                    ...current,
                    ...files.slice(0, remainingSlots),
                ]);
                setPromoImagesChanged(true);
            },
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canSubmit) {
            setSnackbarMessage("กรุณากรอกชื่อร้านและชื่อโดเมนให้ถูกต้อง");
            setSnackbarOpen(true);
            return;
        }

        try {
            setSaving(true);
            const currentLogoUrl = logoUrl.trim();
            const currentPromoImageUrls = promoImageUrls.map((url) => url.trim()).filter(Boolean);
            const hasInlineLogo = currentLogoUrl.startsWith("data:");
            const existingPromoImageUrls = currentPromoImageUrls.filter(
                (url) => !url.startsWith("data:") && !url.startsWith("blob:")
            );
            const tenant = await tenantService.saveMyTenant({
                shopName,
                domainSlug: normalizedSlug,
                contactPhone: contactPhone.trim(),
                promptPayId: promptPayId.replace(/\D/g, ""),
                promptPayType,
                bankName: bankName.trim(),
                bankAccountName: bankAccountName.trim(),
                bankAccountNumber: bankAccountNumber.replace(/\D/g, ""),
                facebookPageUrl: facebookPageUrl.trim(),
                ...(logoChanged || hasInlineLogo
                    ? {
                        logoUrl: currentLogoUrl,
                        logoFile,
                    }
                    : {}),
                ...(promoImagesChanged
                    ? {
                        promoImageUrl: existingPromoImageUrls[0] || null,
                        promoImageUrls: existingPromoImageUrls,
                        promoImageFiles,
                        clearPromoImages: currentPromoImageUrls.length === 0,
                    }
                    : {}),
            });
            const nextLogoUrl = tenant.logoUrl || "";
            const nextPromoImageUrls =
                tenant.promoImageUrls?.length
                    ? tenant.promoImageUrls
                    : tenant.promoImageUrl
                      ? [tenant.promoImageUrl]
                      : [];
            writeStoreProfile({
                tenantId: tenant.id,
                shopName: tenant.shopName,
                domainSlug: tenant.domainSlug,
                storefrontDomain: tenant.publicDomain,
                ownerEmail: tenant.ownerEmail,
                status: tenant.status,
                plan: tenant.plan,
                logoUrl: nextLogoUrl || null,
                promoImageUrl: nextPromoImageUrls[0] || null,
                promoImageUrls: nextPromoImageUrls,
                contactPhone: tenant.contactPhone || contactPhone.trim(),
                promptPayId: tenant.promptPayId || promptPayId.replace(/\D/g, ""),
                promptPayType: tenant.promptPayType || promptPayType,
                bankName: tenant.bankName || bankName.trim(),
                bankAccountName: tenant.bankAccountName || bankAccountName.trim(),
                bankAccountNumber: tenant.bankAccountNumber || bankAccountNumber.replace(/\D/g, ""),
                facebookPageUrl: tenant.facebookPageUrl || facebookPageUrl.trim(),
                createdAt: tenant.createdAt,
                updatedAt: tenant.updatedAt,
            });
            setLogoUrl(nextLogoUrl);
            setPromoImageUrls(nextPromoImageUrls);
            setContactPhone(tenant.contactPhone || contactPhone.trim());
            setPromptPayId(tenant.promptPayId || promptPayId.replace(/\D/g, ""));
            setPromptPayType(tenant.promptPayType || promptPayType);
            setBankName(tenant.bankName || bankName.trim());
            setBankAccountName(tenant.bankAccountName || bankAccountName.trim());
            setBankAccountNumber(tenant.bankAccountNumber || bankAccountNumber.replace(/\D/g, ""));
            setFacebookPageUrl(tenant.facebookPageUrl || facebookPageUrl.trim());
            setLogoFile(null);
            setPromoImageFiles([]);
            setLogoChanged(false);
            setPromoImagesChanged(false);
            setSnackbarMessage("บันทึกข้อมูลร้านเรียบร้อยแล้ว");
            setSnackbarOpen(true);
        } catch (error: unknown) {
            setSnackbarMessage(
                error instanceof Error
                    ? error.message
                    : "ไม่สามารถบันทึกข้อมูลร้านได้"
            );
            setSnackbarOpen(true);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Box className="partner-page">
            <Box className="partner-page-header">
                <Typography className="partner-page-title">
                    ตั้งค่าหน้าร้านให้พร้อมใช้งาน
                </Typography>
                <Typography className="partner-page-subtitle">
                    จัดข้อมูลหลักของร้าน รูปภาพ และช่องทางติดต่อให้ลูกค้าเห็นถูกต้อง
                </Typography>
            </Box>

            <Box className="grid gap-5">
                <Card elevation={0} className="partner-card rounded-[34px]!">
                    <CardContent className="p-5! md:p-7!">
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            className="grid gap-5"
                        >
                            <Box className="grid gap-2">
                                <Typography className="partner-section-title text-slate-950">
                                    1. ข้อมูลร้านและโดเมน
                                </Typography>
                                <Typography className="partner-section-subtitle">
                                    ตั้งชื่อร้านและลิงก์หน้าร้านก่อน เพื่อให้ระบบรู้ว่าร้านนี้คือใคร
                                </Typography>
                            </Box>

                            <Box className="grid gap-4 rounded-[30px] border border-slate-200 bg-white p-4 md:p-5">
                                <TextField
                                    label="ชื่อร้าน"
                                    value={shopName}
                                    onChange={(event) => setShopName(event.target.value)}
                                    fullWidth
                                    error={!!shopError}
                                    helperText={shopError || "เช่น ฟูลแทงค์ พรีเมียม เรนทัล"}
                                />

                                <TextField
                                    label="ชื่อโดเมนของร้าน"
                                    value={domainSlug}
                                    onChange={(event) =>
                                        setDomainSlug(normalizeDomainSlug(event.target.value))
                                    }
                                    fullWidth
                                    error={!!domainError}
                                    helperText={
                                        domainError ||
                                        "ใช้ภาษาอังกฤษ ตัวเลข และขีดกลางเท่านั้น เช่น fulltank-garage"
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography className="text-sm font-semibold text-slate-500">
                                                    .{RENTFLOW_ROOT_DOMAIN}
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box className="rounded-[30px] border border-slate-200 bg-slate-50 p-4 md:p-5">
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={2.5}
                                    className="items-start sm:items-center"
                                >
                                    <Box className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[28px] bg-[var(--rf-partner-chip)] text-[2rem] font-black tracking-[-0.04em] text-slate-600 md:h-28 md:w-28">
                                        {logoUrl ? (
                                            <Box
                                                component="img"
                                                src={logoUrl}
                                                alt="โลโก้ร้าน"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            shopName.trim().charAt(0) || "ร"
                                        )}
                                    </Box>

                                    <Box className="min-w-0 flex-1">
                                        <Typography className="text-[1.02rem] font-bold tracking-[-0.03em] text-slate-950 md:text-[1.1rem]">
                                            2. โลโก้ร้าน
                                        </Typography>
                                        <Typography className="mt-1 text-[0.92rem] leading-7 text-slate-500 md:text-[0.97rem]">
                                            ใช้แสดงบนแถบเมนู โปรไฟล์ร้าน และหน้าร้าน
                                            แนะนำเป็นไฟล์สี่เหลี่ยมจัตุรัส ขนาดไม่เกิน 5 เมกะไบต์
                                        </Typography>
                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={1.25}
                                            className="mt-4"
                                        >
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                className="rounded-full!"
                                            >
                                                เลือกรูปโลโก้
                                                <input
                                                    hidden
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={handleLogoChange}
                                                />
                                            </Button>
                                            {logoUrl ? (
                                                <Button
                                                    variant="text"
                                                    color="error"
                                                    className="rounded-full!"
                                                    onClick={() => {
                                                        setLogoUrl("");
                                                        setLogoFile(null);
                                                        setLogoChanged(true);
                                                    }}
                                                >
                                                    ลบโลโก้
                                                </Button>
                                            ) : null}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Box>

                            <Box className="rounded-[30px] border border-slate-200 bg-slate-50 p-4 md:p-5">
                                <Stack spacing={2.5}>
                                    <Box className="overflow-hidden rounded-[28px] bg-white">
                                        {promoImageUrls.length ? (
                                            <Box className="grid gap-3 p-3 sm:grid-cols-2">
                                                {promoImageUrls.map((imageUrl, index) => (
                                                    <Box
                                                        key={`${imageUrl}-${index}`}
                                                        className="relative overflow-hidden rounded-[22px] bg-slate-100"
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={imageUrl}
                                                            alt={`รูปโปรโมชันหน้าร้าน ${index + 1}`}
                                                            className="h-44 w-full object-cover md:h-52"
                                                        />
                                                        <Box className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                                                            รูปที่ {index + 1}
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box className="grid h-56 place-items-center px-6 text-center text-slate-500 md:h-72">
                                                ยังไม่มีรูปโปรโมชันหน้าร้าน
                                            </Box>
                                        )}
                                    </Box>

                                    <Box className="grid gap-1">
                                        <Typography className="text-[1.02rem] font-bold tracking-[-0.03em] text-slate-950 md:text-[1.1rem]">
                                            3. รูปโปรโมชันหน้าร้าน
                                        </Typography>
                                        <Typography className="text-[0.92rem] leading-7 text-slate-500 md:text-[0.97rem]">
                                            เลือกได้หลายรูป ระบบจะเลื่อนโชว์บนหน้าแรกของร้านโดยอัตโนมัติ
                                        </Typography>
                                    </Box>

                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={1.25}
                                    >
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            className="rounded-full!"
                                        >
                                            เลือกรูปโปรโมชัน
                                            <input
                                                hidden
                                                type="file"
                                                multiple
                                                accept="image/png,image/jpeg,image/webp"
                                                onChange={handlePromoImagesChange}
                                            />
                                        </Button>
                                        {promoImageUrls.length ? (
                                            <Button
                                                variant="text"
                                                color="error"
                                                className="rounded-full!"
                                                onClick={() => {
                                                    setPromoImageUrls([]);
                                                    setPromoImageFiles([]);
                                                    setPromoImagesChanged(true);
                                                }}
                                            >
                                                ลบรูปโปรโมชันทั้งหมด
                                            </Button>
                                        ) : null}
                                    </Stack>
                                </Stack>
                            </Box>

                            <Box className="grid gap-4 rounded-[30px] border border-slate-200 bg-white p-4 md:p-5">
                                <Box className="grid gap-1">
                                    <Typography className="text-[1.02rem] font-bold tracking-[-0.03em] text-slate-950 md:text-[1.1rem]">
                                        4. ช่องทางติดต่อหน้าร้าน
                                    </Typography>
                                    <Typography className="text-[0.92rem] leading-7 text-slate-500 md:text-[0.97rem]">
                                        ข้อมูลส่วนนี้จะแสดงใน footer ของหน้าร้าน เพื่อให้ลูกค้าติดต่อร้านได้ทันที
                                    </Typography>
                                </Box>

                                <TextField
                                    label="เบอร์โทรศัพท์ร้าน"
                                    value={contactPhone}
                                    onChange={(event) => setContactPhone(event.target.value)}
                                    fullWidth
                                    helperText="เช่น 0812345678 หรือ 02-123-4567"
                                />

                                <Box className="grid gap-3 rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                                    <Box className="grid gap-1">
                                        <Typography className="text-[1rem] font-bold tracking-[-0.03em] text-slate-950 md:text-[1.06rem]">
                                            รับชำระเงินด้วยพร้อมเพย์
                                        </Typography>
                                        <Typography className="text-[0.92rem] leading-7 text-slate-500 md:text-[0.97rem]">
                                            ใช้สำหรับสร้าง QR ล็อกยอดให้ลูกค้าชำระเงินเข้าร้านนี้โดยตรง
                                        </Typography>
                                    </Box>
                                    <Box className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                                        <TextField
                                            select
                                            label="ประเภทพร้อมเพย์"
                                            value={promptPayType}
                                            onChange={(event) => setPromptPayType(event.target.value)}
                                            fullWidth
                                        >
                                            <MenuItem value="phone">เบอร์มือถือ</MenuItem>
                                            <MenuItem value="national_id">เลขบัตรประชาชน</MenuItem>
                                            <MenuItem value="tax_id">เลขผู้เสียภาษี</MenuItem>
                                            <MenuItem value="e_wallet">e-Wallet</MenuItem>
                                        </TextField>
                                        <TextField
                                            label="เบอร์/เลขพร้อมเพย์ของร้าน"
                                            value={promptPayId}
                                            onChange={(event) => setPromptPayId(event.target.value.replace(/\D/g, ""))}
                                            fullWidth
                                            inputProps={{ inputMode: "numeric" }}
                                            helperText={
                                                promptPayType === "phone"
                                                    ? "เช่น 0812345678"
                                                    : promptPayType === "e_wallet"
                                                      ? "กรอกเลข e-Wallet 15 หลัก"
                                                      : "กรอกเลข 13 หลัก"
                                            }
                                        />
                                    </Box>
                                </Box>

                                <Box className="grid gap-3 rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                                    <Box className="grid gap-1">
                                        <Typography className="text-[1rem] font-bold tracking-[-0.03em] text-slate-950 md:text-[1.06rem]">
                                            บัญชีธนาคารสำหรับรับโอน
                                        </Typography>
                                        <Typography className="text-[0.92rem] leading-7 text-slate-500 md:text-[0.97rem]">
                                            แสดงในหน้าชำระเงินให้ลูกค้าคัดลอกเลขบัญชีและแนบสลิปหลังโอน
                                        </Typography>
                                    </Box>
                                    <Box className="grid gap-3 md:grid-cols-3">
                                        <TextField
                                            select
                                            label="ธนาคาร"
                                            value={bankName}
                                            onChange={(event) => setBankName(event.target.value)}
                                            fullWidth
                                            helperText="เช่น ธนาคารกสิกรไทย"
                                        >
                                            {bankOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            label="ชื่อบัญชี"
                                            value={bankAccountName}
                                            onChange={(event) => setBankAccountName(event.target.value)}
                                            fullWidth
                                            placeholder="บริษัท สยามเรนท์อะคาร์ จำกัด"
                                            InputLabelProps={{ shrink: true }}
                                            helperText="เช่น บริษัท เรนท์โฟลว์ จำกัด"
                                        />
                                        <TextField
                                            label="เลขบัญชี"
                                            value={bankAccountNumber}
                                            onChange={(event) => setBankAccountNumber(event.target.value.replace(/\D/g, ""))}
                                            fullWidth
                                            placeholder="1234567890"
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{ inputMode: "numeric" }}
                                            helperText="กรอกเฉพาะตัวเลข"
                                        />
                                    </Box>
                                </Box>

                                <TextField
                                    label="ลิงก์เพจ Facebook"
                                    value={facebookPageUrl}
                                    onChange={(event) => setFacebookPageUrl(event.target.value)}
                                    fullWidth
                                    helperText="เช่น https://m.me/your-shop หรือ https://facebook.com/your-shop"
                                />

                            </Box>

                            <Box className="grid gap-3 rounded-[30px] border border-slate-200 bg-white p-4 md:p-5">
                                <Typography className="text-[1rem] font-bold tracking-[-0.03em] text-slate-950 md:text-[1.06rem]">
                                    5. ตัวอย่างลิงก์หน้าร้าน
                                </Typography>
                                <Typography className="break-all text-[1.3rem] font-black tracking-[-0.045em] text-slate-950 md:text-[1.9rem]">
                                    https://{storefrontDomain}
                                </Typography>
                                <Typography className="text-[0.92rem] leading-7 text-slate-500 md:text-[0.97rem]">
                                    ลูกค้าจะเข้าหน้าร้านของคุณผ่านลิงก์นี้
                                    ส่วนหลังบ้านยังใช้งานผ่าน `partner.rentflow.com` เหมือนเดิม
                                </Typography>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!canSubmit}
                                className="rounded-2xl! py-3.5! font-bold!"
                                sx={{
                                    bgcolor: "rgb(15 23 42)",
                                    "&:hover": { bgcolor: "rgb(2 6 23)" },
                                }}
                            >
                                {saving ? (
                                    <Stack direction="row" className="items-center gap-2">
                                        <CircularProgress size={18} />
                                        <span>กำลังบันทึก...</span>
                                    </Stack>
                                ) : (
                                    "บันทึกข้อมูลร้าน"
                                )}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3500}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="warning"
                    onClose={() => setSnackbarOpen(false)}
                    className="rounded-xl!"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
