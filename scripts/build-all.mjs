import { spawnSync } from "node:child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const studio = path.join(root, "studio");

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

run("npm", ["install"], studio);
run("npm", ["run", "build"], studio);
run("node", [path.join(root, "scripts", "assemble-dist.mjs")], root);
