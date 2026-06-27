# RentFlowCar Shared Types

Shared TypeScript API contracts used by the customer, admin, and partner apps.

`src/` is the source of truth. Each app syncs the needed files into `src/shared/types/` before `next dev` and `next build` so local imports keep working in app-only Railway build contexts.
