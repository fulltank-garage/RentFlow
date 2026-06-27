import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sharedSource = resolve(
  appRoot,
  process.env.RENTFLOW_SHARED_UI_SOURCE || "../_shared/ui/theme.css",
);
const localTarget = resolve(appRoot, "app/shared-ui-theme.css");

if (existsSync(sharedSource)) {
  mkdirSync(dirname(localTarget), { recursive: true });
  copyFileSync(sharedSource, localTarget);
  console.log(`Synced shared UI theme from ${sharedSource}`);
} else if (existsSync(localTarget)) {
  console.log(
    "Using committed app/shared-ui-theme.css; shared source is not available in this build context.",
  );
} else {
  console.error(
    "Missing shared UI theme. Expected apps/_shared/ui/theme.css or app/shared-ui-theme.css.",
  );
  process.exit(1);
}
