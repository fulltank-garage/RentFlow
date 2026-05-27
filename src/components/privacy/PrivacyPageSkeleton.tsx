import {
  Box,
  Container,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
} from "@mui/material";

function HeaderSkeleton() {
  return (
    <Box className="mx-auto max-w-3xl text-center">
      <Stack spacing={0} className="items-center">
        <Stack className="w-full items-center">
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: { xs: "100%", sm: 420 },
              maxWidth: "100%",
              height: 48,
              borderRadius: "8px",
              transform: "none",
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: { xs: "100%", sm: 360 },
              maxWidth: "100%",
              height: 22,
              borderRadius: "8px",
              transform: "none",
              marginTop: "8px",
            }}
          />
          <Box className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{
                width: 170,
                height: 28,
                borderRadius: "999px",
              }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{
                width: 280,
                height: 28,
                borderRadius: "999px",
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

function TocSkeleton() {
  return (
    <Box className="flex flex-col gap-4">
      <Box>
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 55,
            height: 20,
            borderRadius: "8px",
            transform: "none",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: 180,
            height: 18,
            borderRadius: "8px",
            transform: "none",
            marginTop: "4px",
          }}
        />
      </Box>

      <Box className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            animation="wave"
            sx={{
              width: "100%",
              height: 48,
              borderRadius: "18px",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

function ContentSectionSkeleton({
  lines = 2,
  titleWidth = 120,
}: {
  lines?: number;
  titleWidth?: number;
}) {
  return (
    <Box>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: titleWidth,
          height: 22,
          borderRadius: "8px",
          transform: "none",
        }}
      />

      <Box className="mt-3 flex flex-col gap-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            animation="wave"
            sx={{
              width: i === lines - 1 ? "78%" : "100%",
              height: 18,
              borderRadius: "8px",
              transform: "none",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function PrivacyPageSkeleton() {
  return (
    <Box className="apple-page">
      <Container maxWidth="lg" className="apple-section relative">
        <HeaderSkeleton />

        <Card
          elevation={0}
          className="apple-card apple-card-no-hover mt-10"
        >
          <CardContent className="p-5! md:p-7!">
            <Box className="apple-card apple-card-no-hover rounded-[26px] bg-[var(--rf-apple-surface-soft)] p-4! md:p-5!">
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: 80,
                  height: 20,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
              <Box className="mt-3 flex flex-col gap-2.5">
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "100%",
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{
                    width: "86%",
                    height: 18,
                    borderRadius: "8px",
                    transform: "none",
                  }}
                />
              </Box>
            </Box>

            <Divider className="my-6! border-black/10!" />

            <TocSkeleton />

            <Divider className="my-6! border-black/10!" />

            <Stack spacing={5}>
              <ContentSectionSkeleton titleWidth={90} lines={2} />
              <ContentSectionSkeleton titleWidth={120} lines={4} />
              <ContentSectionSkeleton titleWidth={150} lines={4} />
              <ContentSectionSkeleton titleWidth={130} lines={2} />
              <ContentSectionSkeleton titleWidth={155} lines={2} />
              <ContentSectionSkeleton titleWidth={105} lines={2} />
              <ContentSectionSkeleton titleWidth={145} lines={4} />
              <ContentSectionSkeleton titleWidth={150} lines={2} />
              <ContentSectionSkeleton titleWidth={95} lines={2} />

              <Divider className="my-2! border-black/10!" />

              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: "100%",
                  height: 16,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: "84%",
                  height: 16,
                  borderRadius: "8px",
                  transform: "none",
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
