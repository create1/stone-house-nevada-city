import { spawnSync } from "node:child_process";
import path from "path";
import { fileURLToPath } from "url";

const studio = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "studio");

function run(cmd, args) {
  const r = spawnSync(cmd, args, {
    cwd: studio,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("npm", ["install"]);
run("npm", ["run", "build"]);
