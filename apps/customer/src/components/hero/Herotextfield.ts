import type { SxProps, Theme } from "@mui/material";

export const Herotextfield: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: "15px !important",

        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(203,213,225,0.8)",
            borderWidth: 1.5,
            borderRadius: "15px !important",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(148,163,184)",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(15 23 42)",
            borderWidth: 2,
            borderRadius: "15px !important",
        },
    },

    "& .MuiInputBase-root": {
        borderRadius: "15px !important",
    },
};