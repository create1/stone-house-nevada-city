import { spawnSync } from "node:child_process";
import path from "path";
import { fileURLToPath } from "url";

const studio = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "studio");

spawnSync("npm", ["install"], {
  cwd: studio,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});

const r = spawnSync("npm", ["run", "dev"], {
  cwd: studio,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});
process.exit(r.status ?? 0);
