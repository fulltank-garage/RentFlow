# RentFlowCar Shared Utils

Shared browser-safe utility functions used by the customer, admin, and partner apps.

`src/` is the source of truth. Each app syncs the needed files into `src/shared/utils/` before `next dev` and `next build` so local imports keep working in app-only Railway build contexts.
