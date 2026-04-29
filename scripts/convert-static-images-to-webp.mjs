import { readdir, writeFile, unlink, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const QUALITY = 82;
const MAX_WIDTH = 2400;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let count = 0;
let saved = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

  const before = (await stat(file)).size;
  const webpPath = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");

  const buffer = await sharp(file)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  await writeFile(webpPath, buffer);
  await unlink(file);

  const after = buffer.length;
  count++;
  saved += before - after;
  console.log(`  ${path.relative(process.cwd(), file)} (${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB)`);
}

console.log(`\nFertig: ${count} Bilder konvertiert, ${(saved / 1024).toFixed(0)} kB gespart.`);
