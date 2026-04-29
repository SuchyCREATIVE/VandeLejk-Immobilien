import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { readFile, writeFile, unlink, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const dbPath = dbUrl.replace(/^file:/, "");
const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
const adapter = new PrismaBetterSqlite3({ url: resolvedPath });
const prisma = new PrismaClient({ adapter });

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "properties");
const MAX_WIDTH = 1920;
const QUALITY = 82;

async function main() {
  const properties = await prisma.property.findMany();
  let touchedFiles = 0;
  let touchedRows = 0;
  let savedBytes = 0;

  for (const p of properties) {
    const photos: string[] = JSON.parse(p.photos);
    const newPhotos: string[] = [];
    let rowChanged = false;

    for (const url of photos) {
      if (url.toLowerCase().endsWith(".webp")) {
        newPhotos.push(url);
        continue;
      }
      if (!url.startsWith("/api/uploads/properties/")) {
        console.warn(`  Unbekanntes Pfadformat, übersprungen: ${url}`);
        newPhotos.push(url);
        continue;
      }

      const cleanUrl = url.split("?")[0];
      const oldName = path.basename(cleanUrl);
      const oldDiskPath = path.join(UPLOAD_DIR, oldName);

      try {
        const before = (await stat(oldDiskPath)).size;

        const newName = oldName.replace(/\.[^.]+$/, ".webp");
        const newDiskPath = path.join(UPLOAD_DIR, newName);

        const buffer = await sharp(oldDiskPath)
          .rotate()
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toBuffer();

        await writeFile(newDiskPath, buffer);

        if (newDiskPath !== oldDiskPath) {
          await unlink(oldDiskPath);
        }

        const after = buffer.length;
        touchedFiles++;
        savedBytes += before - after;
        rowChanged = true;
        newPhotos.push(`/api/uploads/properties/${newName}`);

        console.log(`  ${oldName} → ${newName} (${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB)`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`  Fehler bei ${oldName}: ${msg}`);
        newPhotos.push(url);
      }
    }

    if (rowChanged) {
      await prisma.property.update({
        where: { id: p.id },
        data: { photos: JSON.stringify(newPhotos) },
      });
      touchedRows++;
    }
  }

  console.log(`\nFertig: ${touchedFiles} Dateien konvertiert in ${touchedRows} Properties, ${(savedBytes / 1024).toFixed(0)} kB gespart.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
