export type StorefrontBlock = {
  id?: string;
  type?:
    | "hero"
    | "text"
    | "feature"
    | "promo"
    | "steps"
    | "testimonial"
    | "faq"
    | "cta"
    | "announcement";
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttonLabel?: string;
  href?: string;
  tone?: "default" | "highlight" | "dark" | "success";
  align?: "left" | "center";
};

export type StorefrontTheme = {
  primaryColor?: string;
  accentColor?: string;
  surfaceColor?: string;
};

export type StorefrontPage = {
  id?: string;
  tenantId?: string;
  scope: "tenant" | "marketplace";
  page: string;
  theme?: StorefrontTheme;
  blocks?: StorefrontBlock[];
  isPublished?: boolean;
};
