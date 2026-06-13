import { Box, Stack, Typography } from "@mui/material";

type Section = {
  id: string;
  title: string;
};

export default function PrivacyTableOfContents({
  sections,
}: {
  sections: Section[];
}) {
  return (
    <Box className="flex flex-col gap-4">
      <Box>
        <Typography className="apple-card-title font-bold tracking-[-0.03em] text-[var(--rf-apple-ink)]">
          สารบัญ
        </Typography>
        <Typography className="apple-body-sm mt-1 text-[var(--rf-apple-muted)]">
          เลือกหัวข้อที่ต้องการอ่านได้ทันที
        </Typography>
      </Box>

      <Stack className="grid gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="apple-card apple-body-sm rounded-[18px]! border border-black/10 bg-[var(--rf-apple-surface-soft)] px-4 py-3 font-semibold text-[var(--rf-apple-ink)]"
          >
            {section.title}
          </a>
        ))}
      </Stack>
    </Box>
  );
}
