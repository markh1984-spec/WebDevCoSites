#!/usr/bin/env node
/* ==========================================================
   FamCo house sites — start a new house
   ----------------------------------------------------------
     node famco/new-house.mjs houses/12-acacia-avenue "12 Acacia Avenue"

   Creates the folder with a blank content.js (from
   famco/template/content.example.js) and a photos/ folder, adds it
   to famco/houses.json, and builds it once.
   ========================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildHouse } from "./build.mjs";

const FAMCO = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(FAMCO);
const [folder, line1] = process.argv.slice(2);

if (!folder || !line1) {
  console.error('Usage: node famco/new-house.mjs houses/<folder-name> "<first line of the address>"');
  process.exit(1);
}
const dir = path.resolve(ROOT, folder);
const name = path.relative(ROOT, dir).split(path.sep).join("/");
if (fs.existsSync(path.join(dir, "content.js"))) {
  console.error(`${name} already has a content.js. Pick another folder, or edit that one.`);
  process.exit(1);
}

fs.mkdirSync(path.join(dir, "photos"), { recursive: true });
const example = fs.readFileSync(path.join(FAMCO, "template", "content.example.js"), "utf8");
fs.writeFileSync(path.join(dir, "content.js"), example.replace("{{LINE1}}", JSON.stringify(line1).slice(1, -1)));

const listFile = path.join(FAMCO, "houses.json");
const houses = JSON.parse(fs.readFileSync(listFile, "utf8"));
if (!houses.includes(name)) houses.push(name);
fs.writeFileSync(listFile, JSON.stringify(houses, null, 2) + "\n");

buildHouse(name);
console.log(`
Next:
  1. Fill in ${name}/content.js (address, site.url, seo.summary, then the rest as it comes).
  2. Put the resized photos in ${name}/photos/ and list them in content.js.
  3. node famco/build.mjs ${name}
  4. Commit and push, then add a Vercel project with Root Directory "${name}".`);
