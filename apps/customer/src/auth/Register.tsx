"use client";

import * as React from "react";
import Link from "next/link";
import AuthCard from "@/src/auth/AuthCard";

export default function RegisterPage() {
  return (
    <AuthCard
      mode="register"
      title="สมัครสมาชิก"
      subtitle="สร้างบัญชีด้วยชื่อผู้ใช้ รหัสผ่าน ชื่อจริง และนามสกุล"
      successMessage="สมัครสมาชิกสำเร็จ กำลังพาไปหน้าหลัก..."
      submitErrorMessage="สมัครสมาชิกไม่สำเร็จ"
      agreementText={
        <>
          เมื่อดำเนินการต่อ ถือว่าคุณยอมรับ{" "}
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
