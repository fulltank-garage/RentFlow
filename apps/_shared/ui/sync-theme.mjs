import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../..");
const source = resolve(repoRoot, "apps/_shared/ui/theme.css");
const targets = [
  "apps/customer/app/shared-ui-theme.css",
  "apps/admin/app/shared-ui-theme.css",
  "apps/partner/app/shared-ui-theme.css",
];

for (const target of targets) {
  const destination = resolve(repoRoot, target);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
}
