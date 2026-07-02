"use client";

import * as React from "react";
import { Button, InputAdornment } from "@mui/material";

type PasswordVisibilityAdornmentProps = {
  visible: boolean;
  onToggle: () => void;
};

export default function PasswordVisibilityAdornment({
  visible,
  onToggle,
}: PasswordVisibilityAdornmentProps) {
  const label = visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน";

  return (
    <InputAdornment position="end" className="ml-1! mr-1.5!">
      <Button
        size="small"
        aria-label={label}
        onClick={onToggle}
        onMouseDown={(event) => event.preventDefault()}
        disableRipple
        className="min-w-0! rounded-full! px-1! py-0.5! text-[11px]! font-semibold! leading-none! text-[var(--rf-apple-muted)]! transition-colors duration-200 hover:bg-transparent! hover:text-[var(--rf-apple-ink)]!"
      >
        {label}
      </Button>
    </InputAdornment>
  );
}
