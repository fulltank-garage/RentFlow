"use client";

import * as React from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";

function FieldShell({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Box
      className={`rounded-[22px] bg-[var(--rf-apple-surface-soft)] px-4 py-4 md:px-5 md:py-4.5 ${className || ""}`}
    >
      <Typography className="apple-label-text mb-1.5 font-medium uppercase text-[var(--rf-apple-muted)]">
        {label}
      </Typography>
      {children}
    </Box>
  );
}

type ProfileFieldProps = {
  label: string;
  value: string;
  id?: string;
  name?: string;
  mode?: "view" | "edit";
  onChange?: (value: string) => void;
  type?: React.InputHTMLAttributes<unknown>["type"];
  disabled?: boolean;
  placeholder?: string;
  shellClassName?: string;
};

export function ProfileField({
  label,
  value,
  id,
  name,
  mode = "view",
  onChange,
  type = "text",
  disabled = false,
  placeholder,
  shellClassName,
}: ProfileFieldProps) {
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = React.useState(false);
  const generatedFieldId = React.useId();
  const fieldId =
    id ||
    `profile-${label.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || generatedFieldId}`;
  const fieldName =
    name ||
    label.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") ||
    fieldId;
  const resolvedType =
    isPasswordField && showPassword ? "text" : type;

  return (
    <FieldShell label={label} className={shellClassName}>
      {mode === "edit" ? (
        <TextField
          id={fieldId}
          name={fieldName}
          fullWidth
          variant="standard"
          value={value}
          type={resolvedType}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          InputLabelProps={type === "date" ? { shrink: true } : undefined}
          InputProps={{
            disableUnderline: true,
            endAdornment: isPasswordField ? (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={() => setShowPassword((prev) => !prev)}
                  onMouseDown={(event) => event.preventDefault()}
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="min-w-0! rounded-full! px-2! py-1! text-[var(--rf-apple-muted)]!"
                >
                  {showPassword ? "ซ่อน" : "แสดง"}
                </Button>
              </InputAdornment>
            ) : undefined,
          }}
          sx={{
            "& .MuiInputBase-root": {
              minHeight: "30px",
              alignItems: "center",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--rf-apple-ink)",
              lineHeight: 1.75,
            },
            "& .MuiInputBase-input": {
              padding: 0,
            },
            "& .MuiInputAdornment-root": {
              marginLeft: "8px",
            },
            "& .MuiButton-root": {
              color: "var(--rf-apple-muted)",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "var(--rf-apple-muted)",
              opacity: 1,
              fontWeight: 500,
            },
            "& .Mui-disabled": {
              WebkitTextFillColor: "var(--rf-apple-ink)",
              opacity: 1,
            },
          }}
        />
      ) : (
        <Typography className="min-h-7.5 wrap-break-word text-base font-bold leading-7 text-[var(--rf-apple-ink)]">
          {value || "-"}
        </Typography>
      )}
    </FieldShell>
  );
}

export function InfoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return <ProfileField label={label} value={value} mode="view" />;
}

export function EditField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.InputHTMLAttributes<unknown>["type"];
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <ProfileField
      label={label}
      value={value}
      mode="edit"
      onChange={onChange}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}
