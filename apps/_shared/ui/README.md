# RentFlowCar Shared UI

Shared CSS theme tokens and reusable UI primitives for the customer, admin, and partner Next.js apps.

`theme.css` is the source of truth. Each app imports a local generated copy:

```css
@import "tailwindcss";
@import "./shared-ui-theme.css";
```

Each app runs `node ./scripts/sync-shared-ui.mjs` before `next dev` or `next build`. The app-local wrapper copies `apps/_shared/ui/theme.css` when the full repo is available, and falls back to the committed `app/shared-ui-theme.css` copy in app-only build contexts such as Railway.

The local generated copy avoids Turbopack dev panics caused by CSS imports that resolve outside an app root.
