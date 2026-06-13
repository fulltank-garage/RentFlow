"use client";

import * as React from "react";
import Link from "next/link";
import AuthCard from "@/src/auth/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard
      mode="login"
      title="เข้าสู่ระบบ"
      subtitle="กรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบ"
      successMessage="เข้าสู่ระบบสำเร็จ กำลังพาไปหน้าหลัก..."
      submitErrorMessage="เข้าสู่ระบบไม่สำเร็จ"
      forgotPasswordHref="/forgot-password"
      agreementText={
        <>
          การดำเนินการต่อถือว่าคุณยอมรับ{" "}
          <Link
            href="/terms"
            className="font-semibold text-slate-900"
            style={{
              textDecorationLine: "underline",
              textDecorationThickness: "1.5px",
              textUnderlineOffset: "2px",
            }}
          >
            เงื่อนไขการใช้งาน
          </Link>{" "}
          และ{" "}
          <Link
            href="/privacy"
            className="font-semibold text-slate-900"
            style={{
              textDecorationLine: "underline",
              textDecorationThickness: "1.5px",
              textUnderlineOffset: "2px",
            }}
          >
            นโยบายความเป็นส่วนตัว
          </Link>
        </>
      }
    />
  );
}
