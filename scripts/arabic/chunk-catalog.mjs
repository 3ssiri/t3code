// Splits an English catalog into translator chunks and merges translated chunks back.
// Plain Node ESM, no dependencies.
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";
import * as NodeURL from "node:url";
import { scanIcu } from "./validate-catalog.mjs";

const FSI = "\u2068";
const PDI = "\u2069";

export function splitCatalog(en, size) {
  if (!Number.isInteger(size) || size < 1) throw new Error(`invalid chunk size: ${size}`);
  const entries = Object.entries(en);
  const chunks = [];
  for (let i = 0; i < entries.length; i += size)
    chunks.push(Object.fromEntries(entries.slice(i, i + size)));
  return chunks;
}

/** `labels` name each chunk (its file) in error messages. */
export function mergeChunks(en, chunks, labels = chunks.map((_, i) => `chunk #${i + 1}`)) {
  const merged = {};
  const owner = {};
  chunks.forEach((chunk, idx) => {
    for (const [key, value] of Object.entries(chunk)) {
      if (!Object.hasOwn(en, key)) throw new Error(`unknown key "${key}" in ${labels[idx]}`);
      if (Object.hasOwn(merged, key)) {
        throw new Error(`duplicate key "${key}" in ${owner[key]} and ${labels[idx]}`);
      }
      merged[key] = value;
      owner[key] = labels[idx];
    }
  });
  const missing = Object.keys(en).filter((k) => !Object.hasOwn(merged, k));
  if (missing.length) throw new Error(`missing ${missing.length} key(s), first: "${missing[0]}"`);
  return Object.fromEntries(Object.keys(en).map((k) => [k, merged[k]]));
}

/** Wraps each simple {name} in U+2068..U+2069 (except a plural's own count inside its branches). Idempotent. */
export function isolatePlaceholders(message) {
  const { simple } = scanIcu(message);
  let out = message;
  for (const s of [...simple].sort((a, b) => b.start - a.start)) {
    if (s.exempt) continue;
    if (message[s.start - 1] === FSI && message[s.end] === PDI) continue;
    out = `${out.slice(0, s.end)}${PDI}${out.slice(s.end)}`;
    out = `${out.slice(0, s.start)}${FSI}${out.slice(s.start)}`;
  }
  return out;
}

const pad = (n) => String(n).padStart(3, "0");
const readJson = (file) => JSON.parse(NodeFS.readFileSync(file, "utf8"));
const writeJson = (file, value) =>
  NodeFS.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[++i];
    else out._.push(argv[i]);
  }
  return out;
}

function runSplit(args) {
  const en = readJson(args.en);
  const size = Number(args.size ?? 300);
  const context = args.context ? readJson(args.context) : {};
  NodeFS.mkdirSync(args.out, { recursive: true });
  const chunks = splitCatalog(en, size);
  chunks.forEach((chunk, idx) => {
    writeJson(NodePath.join(args.out, `chunk-${pad(idx + 1)}.en.json`), chunk);
    const ctx = {};
    for (const key of Object.keys(chunk)) if (context[key]) ctx[key] = context[key];
    writeJson(NodePath.join(args.out, `chunk-${pad(idx + 1)}.context.json`), ctx);
  });
  console.log(`chunks=${chunks.length} keys=${Object.keys(en).length}`);
}

function runMerge(args) {
  const en = readJson(args.en);
  const files = NodeFS.readdirSync(args.chunks)
    .filter((f) => /^chunk-\d+\.ar\.json$/.test(f))
    .sort();
  const chunks = files.map((f) => {
    const chunk = readJson(NodePath.join(args.chunks, f));
    return Object.fromEntries(
      Object.entries(chunk).map(([k, v]) => [
        k,
        typeof v === "string" ? isolatePlaceholders(v) : v,
      ]),
    );
  });
  const merged = mergeChunks(en, chunks, files);
  NodeFS.mkdirSync(NodePath.dirname(NodePath.resolve(args.out)), { recursive: true });
  writeJson(args.out, merged);
  console.log(`merged chunks=${files.length} keys=${Object.keys(merged).length}`);
}
const entry = process.argv[1];
if (entry && import.meta.url === NodeURL.pathToFileURL(NodePath.resolve(entry)).href) {
  const args = parseArgs(process.argv.slice(2));
  const [command] = args._;
  if (command === "split" && args.en && args.out) runSplit(args);
  else if (command === "merge" && args.en && args.chunks && args.out) runMerge(args);
  else {
    console.error(
      "usage: chunk-catalog.mjs split --en <en.json> --out <dir> [--size 300] [--context <json>]\n       chunk-catalog.mjs merge --en <en.json> --chunks <dir> --out <ar.json>",
    );
    process.exitCode = 2;
  }
}
