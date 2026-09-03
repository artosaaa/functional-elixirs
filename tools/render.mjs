/* Render art() scenes to PNG with headless Chrome.
   usage: node tools/render.mjs <module.mjs> <variant|all> <productId> <outdir> */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const [, , modPath, variantArg, pid, outDir] = process.argv;
if (!modPath || !variantArg || !pid || !outDir) { console.error("usage: render.mjs <module> <variant|all> <productId> <outdir>"); process.exit(1); }
const root = resolve(new URL(".", import.meta.url).pathname, "..");
const mod = await import(pathToFileURL(resolve(modPath)).href);
const { PRODUCTS } = await import(pathToFileURL(join(root, "src/products.mjs")).href);
const p = PRODUCTS.find((x) => x.id === pid);
if (!p) { console.error("unknown product " + pid); process.exit(1); }
const css = existsSync(join(root, "assets/css/site.css")) ? readFileSync(join(root, "assets/css/site.css"), "utf8") : "";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
mkdirSync(outDir, { recursive: true });
const variants = variantArg === "all" ? ["hero", "front", "open", "cup"] : [variantArg];
for (const v of variants) {
  const H = v === "hero" ? 1200 : 1250;
  const svg = mod.art(v, p, { alt: mod.altFor(p, v), anim: false });
  const html = `<!doctype html><meta charset="utf-8"><style>${css}\nbody{margin:0;background:#F6F0E6}\n#w{width:1000px;height:${H}px}\n.scene{width:1000px;height:${H}px}</style><div id="w">${svg}</div>`;
  const htmlPath = join(outDir, `${pid}-${v}.html`); const png = join(outDir, `${pid}-${v}.png`);
  writeFileSync(htmlPath, html);
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=1000,${H}`, `--screenshot=${png}`, pathToFileURL(htmlPath).href], { stdio: "ignore" });
  console.log(`${v}: ${(svg.length / 1024).toFixed(1)} KB -> ${png}`);
}
