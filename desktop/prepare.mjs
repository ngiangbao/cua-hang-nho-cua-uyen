// Chép các file của bản web vào desktop/app trước khi chạy hoặc đóng gói
import { cpSync, rmSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const out = join(here, "app");
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of ["index.html", "manifest.webmanifest", "sw.js", "version.json", "css", "js", "icons"]) cpSync(join(root, f), join(out, f), { recursive: true });
console.log("Đã chép bản web vào", out);
