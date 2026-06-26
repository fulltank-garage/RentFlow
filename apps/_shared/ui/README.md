# RentFlowCar Shared UI

Shared CSS theme tokens and reusable UI primitives for the customer, admin, and partner Next.js apps.

`theme.css` is the source of truth. Each app imports a local generated copy:

```css
@import "tailwindcss";
@import "./shared-ui-theme.css";
```

Run `node ../_shared/ui/sync-theme.mjs` from an app before `next dev` or `next build` to copy `apps/_shared/ui/theme.css` into that app's `app/shared-ui-theme.css`.

The local generated copy avoids Turbopack dev panics caused by CSS imports that resolve outside an app root.
