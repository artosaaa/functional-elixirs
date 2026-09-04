#!/usr/bin/env node
/* Copy the built site into dist/ for hosts that want a clean output folder (Vercel).
   Sources, tooling and repo files stay out. Zero dependencies. */
import { cpSync, rmSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
const ROOT = process.cwd();
const SKIP = new Set(["dist", "src", "tools", "node_modules", ".git", ".github", ".vercel", ".claude", "build.mjs", "build.sh", "package.json", "package-lock.json", "vercel.json", "README.md", ".gitignore", ".DS_Store"]);
rmSync(join(ROOT, "dist"), { recursive: true, force: true });
mkdirSync(join(ROOT, "dist"));
let n = 0;
for (const name of readdirSync(ROOT)) {
  if (SKIP.has(name)) continue;
  cpSync(join(ROOT, name), join(ROOT, "dist", name), { recursive: true });
  n++;
}
console.log(`packed ${n} top-level entries into dist/`);
