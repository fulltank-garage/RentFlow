import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sharedFiles = [
  {
    source:
      process.env.RENTFLOW_SHARED_UI_SOURCE ||
      "../../packages/shared-ui/src/theme.css",
    target: "app/shared-ui-theme.css",
    label: "shared UI theme",
  },
  {
    source: "../../packages/shared-types/src/api.ts",
    target: "src/shared/types/api.ts",
    label: "shared API types",
  },
  {
    source: "../../packages/shared-utils/src/client-cookie.ts",
    target: "src/shared/utils/client-cookie.ts",
    label: "shared client cookie utils",
  },
];

for (const file of sharedFiles) {
  const sharedSource = resolve(appRoot, file.source);
  const localTarget = resolve(appRoot, file.target);

  if (existsSync(sharedSource)) {
    mkdirSync(dirname(localTarget), { recursive: true });
    copyFileSync(sharedSource, localTarget);
    console.log(`Synced ${file.label} from ${sharedSource}`);
  } else if (existsSync(localTarget)) {
    console.log(
      `Using committed ${file.target}; ${file.label} source is not available in this build context.`,
    );
  } else {
    console.error(
      `Missing ${file.label}. Expected ${sharedSource} or ${localTarget}.`,
    );
    process.exit(1);
  }
}
