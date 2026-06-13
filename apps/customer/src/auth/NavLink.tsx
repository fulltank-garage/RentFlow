"use client";

import Link from "next/link";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";

type NavLinkProps = {
    href: string;
    label: string;
    mobile?: boolean;
    onClick?: () => void;
};

export default function NavLink({
    href,
    label,
    mobile = false,
    onClick,
}: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Button
            component={Link}
            href={href}
            fullWidth={mobile}
            sx={{ textTransform: "none" }}
            className={[
                "apple-nav-link rounded-xl! px-3! py-2!",
                isActive
                    ? "text-slate-900! bg-slate-100!"
                    : "text-slate-600! hover:text-slate-900! hover:bg-slate-100!",
            ].join(" ")}
            onClick={onClick}
        >
            {label}
        </Button>
    );
}
