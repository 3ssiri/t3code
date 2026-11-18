// Builds { "<key>": { "context": "<text>" } } from gt()/msg() calls that carry $context.
// The key is computed with hashMessage from gt-i18n/internal, same as the extractor.
import * as NodeFS from "node:fs";
import * as NodeModule from "node:module";
import * as NodePath from "node:path";
import * as NodeURL from "node:url";

const SOURCE = /\.(?:[cm]?[jt]sx?)$/;
const SKIP_DIR = new Set(["node_modules", "dist", "build", ".next", "coverage"]);
const SKIP_FILE = /\.(?:test|spec|browser|stories)\.[cm]?[jt]sx?$|\.d\.ts$/;

function* walk(dir) {
  for (const entry of NodeFS.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIR.has(entry.name)) yield* walk(NodePath.join(dir, entry.name));
    } else if (SOURCE.test(entry.name) && !SKIP_FILE.test(entry.name)) {
      yield NodePath.join(dir, entry.name);
    }
  }
}

const ESCAPES = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", 0: "\0" };

/** Reads a string literal at src[i]; returns { value, end } or null. Template literals with ${} are rejected. */
export function readStringLiteral(src, i) {
  const quote = src[i];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;
  let value = "";
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === "\\") {
      const next = src[j + 1];
      if (next === "u" && src[j + 2] === "{") {
        const close = src.indexOf("}", j);
        value += String.fromCodePoint(Number.parseInt(src.slice(j + 3, close), 16));
        j = close + 1;
      } else if (next === "u") {
        value += String.fromCharCode(Number.parseInt(src.slice(j + 2, j + 6), 16));
        j += 6;
      } else if (next === "x") {
        value += String.fromCharCode(Number.parseInt(src.slice(j + 2, j + 4), 16));
        j += 4;
      } else if (next === "\n") {
        j += 2;
      } else {
        value += ESCAPES[next] ?? next;
        j += 2;
      }
    } else if (c === quote) {
      return { value, end: j + 1 };
    } else if (quote === "`" && c === "$" && src[j + 1] === "{") {
      return null;
    } else {
      value += c;
      j++;
    }
  }
  return null;
}

/** Finds the matching "}" for the "{" at src[i], skipping string literals. */
function matchBrace(src, i) {
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '"' || c === "'" || c === "`") {
      const lit = readStringLiteral(src, j);
      if (!lit) return -1;
      j = lit.end - 1;
    } else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return j;
  }
  return -1;
}

/** Yields { message, context } for each gt(...)/msg(...) call whose options carry $context. */
export function* extractContexts(src) {
  const call = /(?<![\w$.])(?:gt|msg)\(\s*/g;
  let m;
  while ((m = call.exec(src))) {
    const first = readStringLiteral(src, m.index + m[0].length);
    if (!first) continue;
    let j = first.end;
    while (/\s/.test(src[j] ?? "")) j++;
    if (src[j] !== ",") continue;
    j++;
    while (/\s/.test(src[j] ?? "")) j++;
    if (src[j] !== "{") continue;
    const close = matchBrace(src, j);
    if (close === -1) continue;
    const body = src.slice(j, close + 1);
    const ctx = /\$context\s*:\s*/.exec(body);
    if (!ctx) continue;
    const value = readStringLiteral(body, ctx.index + ctx[0].length);
    if (value) yield { message: first.value, context: value.value };
  }
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++)
    if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[++i];
  return out;
}

function main(argv) {
  const here = NodePath.dirname(NodeURL.fileURLToPath(import.meta.url));
  const root = NodePath.resolve(here, "..", "..");
  const args = parseArgs(argv);
  if (!args.app || !args.out) {
    console.error("usage: context-map.mjs --app apps/web --out <context.json>");
    return 2;
  }
  const appDir = NodePath.resolve(args.app);
  const requireFromDesktop = NodeModule.createRequire(
    NodePath.join(root, "apps", "desktop", "package.json"),
  );
  const { hashMessage } = requireFromDesktop("gt-i18n/internal");

  const map = {};
  for (const file of walk(NodePath.join(appDir, "src"))) {
    for (const { message, context } of extractContexts(NodeFS.readFileSync(file, "utf8"))) {
      map[hashMessage(message, { $context: context, $format: "ICU" })] = { context };
    }
  }
  const enPath = NodePath.join(appDir, "src", "i18n", "translations", "en.json");
  const en = NodeFS.existsSync(enPath) ? JSON.parse(NodeFS.readFileSync(enPath, "utf8")) : {};
  const keys = Object.keys(map);
  const matched = keys.filter((k) => Object.hasOwn(en, k)).length;
  NodeFS.mkdirSync(NodePath.dirname(NodePath.resolve(args.out)), { recursive: true });
  NodeFS.writeFileSync(args.out, `${JSON.stringify(map, null, 2)}\n`);
  console.log(`contexts=${keys.length} matched=${matched}`);
  return 0;
}
const entry = process.argv[1];
if (entry && import.meta.url === NodeURL.pathToFileURL(NodePath.resolve(entry)).href) {
  process.exitCode = main(process.argv.slice(2));
}
