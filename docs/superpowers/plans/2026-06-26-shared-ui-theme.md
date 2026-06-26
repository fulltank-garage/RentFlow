# Shared UI Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move RentFlowCar color tokens and reusable UI CSS primitives into one shared theme used by customer, admin, and partner.

**Architecture:** Create a CSS-only shared UI package under `apps/_shared/ui/theme.css` so all three Next apps can import identical tokens without adding workspace package wiring. Keep each app's `app/globals.css` as the local entrypoint for Tailwind and app-specific selectors, but source shared theme variables and common `.rf-*`, `.admin-*`, `.partner-*`, and `.apple-*` primitives from the shared file.

**Tech Stack:** Next.js App Router, Tailwind CSS v4 CSS imports, plain CSS custom properties.

---

### Task 1: Create Shared Theme CSS

**Files:**
- Create: `apps/_shared/ui/README.md`
- Create: `apps/_shared/ui/theme.css`
- Modify: `apps/customer/app/globals.css`
- Modify: `apps/admin/app/globals.css`
- Modify: `apps/partner/app/globals.css`

- [ ] **Step 1: Create shared UI directory**

Run:
```bash
mkdir -p apps/_shared/ui/styles
```

Expected: directory exists.

- [ ] **Step 2: Move shared color tokens and reusable primitives to `theme.css`**

Create `apps/_shared/ui/theme.css` with:
```css
:root {
  --primary-navy: #011027;
  --secondary-navy: #01122c;
  --navy-deep: #010b1c;
  --navy-soft: #111e30;
  --navy-gray: #283b55;
  --primary-green: #58a847;
  --secondary-green: #51a242;
  --green-dark: #50a041;
  --green-muted: #4f7f64;
  --white: #fefefe;
  --off-white: #f9f9fa;
  --soft-white: #f9fafb;
  --light-gray: #f3f1ef;
  --section-gray: #f7f8f9;
  --gray: #c9cdcb;
  --gray-dark: #878e99;
  --accent-gold: #f0b008;
}
```

Then add aliases for current app selectors:
```css
:root {
  --rf-page-bg: var(--soft-white);
  --rf-surface: var(--white);
  --rf-surface-soft: var(--section-gray);
  --rf-ink: var(--primary-navy);
  --rf-muted: var(--gray-dark);
  --rf-line: color-mix(in srgb, var(--navy-gray) 18%, transparent);
  --rf-line-strong: color-mix(in srgb, var(--navy-gray) 28%, transparent);
  --rf-brand: var(--primary-green);
  --rf-brand-hover: var(--secondary-green);
  --rf-brand-dark: var(--green-dark);
  --rf-chip: var(--light-gray);
}
```

- [ ] **Step 3: Import shared theme from every app**

At the top of each app `globals.css`, keep Tailwind first and add:
```css
@import "../../../apps/_shared/ui/theme.css";
```

- [ ] **Step 4: Remove duplicated color declarations from app roots**

Replace app-local root values with aliases to shared variables, for example:
```css
--rf-admin-bg: var(--rf-page-bg);
--rf-admin-ink: var(--rf-ink);
--rf-admin-muted: var(--rf-muted);
--rf-admin-green: var(--rf-brand);
```

Expected: app CSS still owns app-specific class names, but color values come from shared theme.

### Task 2: Verify Shared Theme Adoption

**Files:**
- Check: `apps/_shared/ui/theme.css`
- Check: `apps/customer/app/globals.css`
- Check: `apps/admin/app/globals.css`
- Check: `apps/partner/app/globals.css`

- [ ] **Step 1: Search for old hard-coded primary colors**

Run:
```bash
rg -n "#0071e3|#2563eb|#22c55e|#0f172a|#667085" apps/customer/app apps/admin/app apps/partner/app apps/customer/src apps/admin/src apps/partner/src
```

Expected: no matches in app theme entrypoints except intentional semantic status colors if present in component-specific code.

- [ ] **Step 2: Verify all apps import shared theme**

Run:
```bash
rg -n "shared-ui-theme.css" apps/customer/app/globals.css apps/admin/app/globals.css apps/partner/app/globals.css
```

Expected: three matches.

- [ ] **Step 3: Build all apps**

Run:
```bash
cd apps/customer && npm run build
cd ../admin && npm run build
cd ../partner && npm run build
```

Expected: all builds pass.

- [ ] **Step 4: Commit and push**

Run:
```bash
git add apps/_shared/ui apps/customer/app/globals.css apps/admin/app/globals.css apps/partner/app/globals.css docs/superpowers/plans/2026-06-26-shared-ui-theme.md
git commit -m "refactor: share UI theme across apps"
git push origin rentflow
```

Expected: branch `rentflow` pushed.
