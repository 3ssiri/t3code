// Validates an Arabic translation catalog against its English source.
// Plain Node ESM, no dependencies.
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";
import * as NodeURL from "node:url";

const FSI = "\u2068";
const PDI = "\u2069";
const ARABIC_PLURAL = ["zero", "one", "two", "few", "many", "other"];
const BLOCK_KINDS = new Set(["plural", "select", "selectordinal"]);

/**
 * Scans an ICU message. Counts braces, honours apostrophe quoting
 * (an apostrophe quotes only when followed by `{`, `}` or, inside a plural, `#`;
 * `''` is a literal apostrophe). Throws on unbalanced braces.
 */
export function scanIcu(message) {
  const n = message.length;
  const args = new Set();
  const branches = [];
  const simple = [];
  const pluralStack = [];
  let hashInPlural = false;
  let i = 0;

  const fail = (what) => {
    throw new Error(`${what} at index ${i}`);
  };
  const skipSpaces = () => {
    while (i < n && /\s/.test(message[i])) i++;
  };

  function parseText(depth) {
    while (i < n) {
      const c = message[i];
      if (c === "'") {
        const next = message[i + 1];
        if (next === "'") {
          i += 2;
        } else if (next === "{" || next === "}" || (next === "#" && pluralStack.length > 0)) {
          i++;
          while (i < n) {
            if (message[i] === "'") {
              if (message[i + 1] === "'") {
                i += 2;
                continue;
              }
              i++;
              break;
            }
            i++;
          }
        } else {
          i++;
        }
      } else if (c === "{") {
        parseArgument();
      } else if (c === "}") {
        if (depth === 0) fail("unbalanced '}'");
        i++;
        return;
      } else {
        if (c === "#" && pluralStack.length > 0) hashInPlural = true;
        i++;
      }
    }
    if (depth > 0) fail("unclosed '{'");
  }

  function parseArgument() {
    const open = i;
    i++;
    let start = i;
    while (i < n && message[i] !== "," && message[i] !== "}") i++;
    if (i >= n) fail("unclosed '{'");
    const name = message.slice(start, i).trim();
    if (name === "") fail("empty argument name");
    args.add(name);
    if (message[i] === "}") {
      i++;
      simple.push({ name, start: open, end: i, exempt: pluralStack.includes(name) });
      return;
    }
    i++; // ","
    start = i;
    while (i < n && message[i] !== "," && message[i] !== "}") i++;
    if (i >= n) fail("unclosed '{'");
    const kind = message.slice(start, i).trim();
    if (message[i] === "}") {
      i++;
      return;
    }
    i++; // ","
    if (!BLOCK_KINDS.has(kind)) {
      // number / date / time style: skip to the matching close brace
      let depth = 1;
      while (i < n && depth > 0) {
        if (message[i] === "{") depth++;
        else if (message[i] === "}") depth--;
        i++;
      }
      if (depth > 0) fail("unclosed '{'");
      return;
    }
    const branch = { arg: name, kind, keys: [] };
    branches.push(branch);
    skipSpaces();
    if (kind !== "select" && message.startsWith("offset:", i)) {
      while (i < n && !/\s/.test(message[i])) i++;
    }
    const isPlural = kind !== "select";
    for (;;) {
      skipSpaces();
      if (i >= n) fail("unclosed '{'");
      if (message[i] === "}") {
        i++;
        break;
      }
      const sel = i;
      while (i < n && !/\s/.test(message[i]) && message[i] !== "{" && message[i] !== "}") i++;
      const selector = message.slice(sel, i);
      if (selector === "") fail("missing branch selector");
      skipSpaces();
      if (message[i] !== "{") fail("expected '{' after branch selector");
      i++;
      branch.keys.push(selector);
      if (isPlural) pluralStack.push(name);
      parseText(1);
      if (isPlural) pluralStack.pop();
    }
  }

  parseText(0);
  return { args: [...args], branches, simple, hashInPlural };
}

export function icuShape(message) {
  const { args, branches } = scanIcu(message);
  return { args, branches };
}

const isCompound = (v) => Array.isArray(v);

// Flatten a compound (JSX) entry: strings in order, other objects as a sentinel.
function collectStrings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) collectStrings(v, out);
  else if (value && typeof value === "object") {
    if (value.d && value.d.b && typeof value.d.b === "object") {
      for (const v of Object.values(value.d.b)) collectStrings(v, out);
    }
    if ("c" in value) collectStrings(value.c, out);
  }
  return out;
}

function flatten(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join("");
  return "\u0000";
}

function objectSignatures(value, out = []) {
  if (Array.isArray(value)) {
    for (const v of value) objectSignatures(v, out);
  } else if (value && typeof value === "object") {
    const b =
      value.d && value.d.b && typeof value.d.b === "object" ? Object.keys(value.d.b).sort() : null;
    out.push(
      JSON.stringify({
        t: value.t ?? null,
        i: value.i ?? null,
        k: value.k ?? null,
        v: value.v ?? null,
        b,
      }),
    );
    if ("c" in value) objectSignatures(value.c, out);
  }
  return out;
}

const setEqual = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// A select nested in plural branches repeats once per plural form, so compare as a set.
function selectSignatures(shape) {
  const signatures = shape.branches
    .filter((b) => b.kind === "select")
    .map((b) => `${b.arg}:${[...b.keys].sort().join(",")}`);
  return [...new Set(signatures)].sort();
}

/** Returns lines "<key> <rule> <detail>". */
export function validateEntry(key, en, ar, opts = {}) {
  const keepEnglish = opts.keepEnglish ?? new Set();
  const forbidden = opts.forbidden ?? [];
  const found = new Map(); // rule -> details
  const add = (rule, detail) => {
    if (!found.has(rule)) found.set(rule, []);
    found.get(rule).push(detail);
  };

  const enStr = typeof en === "string";
  const arStr = typeof ar === "string";
  const enArr = isCompound(en);
  const arArr = isCompound(ar);
  if ((enStr && !arStr) || (enArr && !arArr) || (!enStr && !enArr) || (!arStr && !arArr)) {
    add(
      "type-mismatch",
      `en is ${enArr ? "array" : typeof en}, ar is ${arArr ? "array" : typeof ar}`,
    );
  } else {
    const enText = flatten(en);
    const arText = flatten(ar);

    if (enArr) {
      const a = objectSignatures(en).sort();
      const b = objectSignatures(ar).sort();
      if (!sameList(a, b)) add("jsx-structure", "element set differs from English");
    } else {
      checkIcu(en, ar, add);
    }

    const arStrings = collectStrings(ar);
    if (arStrings.some((s) => /[٠-٩۰-۹]/.test(s))) add("arabic-digits", "Arabic-Indic digit found");

    const lead = (s) => s.match(/^\s*/)[0];
    const trail = (s) => s.match(/\s*$/)[0];
    if (lead(enText) !== lead(arText))
      add("edge-whitespace", "leading whitespace differs from English");
    if (trail(enText) !== trail(arText))
      add("edge-whitespace", "trailing whitespace differs from English");

    if (enText === arText && !keepEnglish.has(key)) {
      const stripped = arText.replace(/\{[A-Za-z_][\w]*\}/g, "").replace(/[⁨⁩]/g, "");
      if (/[A-Za-z]/.test(stripped)) add("untranslated", "identical to English");
    }

    const enLower = collectStrings(en).join(" ").toLowerCase();
    const arAll = arStrings.join(" ");
    for (const { term, variant } of forbidden) {
      if (
        !new RegExp(
          `(?<![\\p{L}\\p{N}_])${escapeRegExp(term.toLowerCase())}(?:s|es)?(?![\\p{L}\\p{N}_])`,
          "u",
        ).test(enLower)
      )
        continue;
      if (
        new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(variant)}(?![\\p{L}\\p{N}])`, "u").test(arAll)
      ) {
        add("glossary-forbidden", `"${variant}" for "${term}"`);
      }
    }
  }

  return [...found].map(([rule, details]) => `${key} ${rule} ${details.join("; ")}`);
}

function checkIcu(en, ar, add) {
  let enShape = null;
  try {
    enShape = scanIcu(en);
  } catch (error) {
    add("icu-parse", `English source does not parse: ${error.message}`);
  }
  let arShape;
  try {
    arShape = scanIcu(ar);
  } catch (error) {
    add("icu-parse", error.message);
    checkIsolationMarks(ar, add);
    return;
  }

  if (enShape && !setEqual(new Set(enShape.args), new Set(arShape.args))) {
    const missing = enShape.args.filter((a) => !arShape.args.includes(a));
    const extra = arShape.args.filter((a) => !enShape.args.includes(a));
    add("args-differ", `missing [${missing.join(",")}] extra [${extra.join(",")}]`);
  }
  if (enShape && !sameList(selectSignatures(enShape), selectSignatures(arShape))) {
    add(
      "select-keys-differ",
      `en [${selectSignatures(enShape).join(" ")}] ar [${selectSignatures(arShape).join(" ")}]`,
    );
  }

  for (const branch of arShape.branches.filter((b) => b.kind === "plural")) {
    const have = new Set(branch.keys);
    const missing = ARABIC_PLURAL.filter((k) => !have.has(k));
    const exact = enShape
      ? enShape.branches
          .filter((b) => b.kind === "plural" && b.arg === branch.arg)
          .flatMap((b) => b.keys.filter((k) => k.startsWith("=")))
      : [];
    const missingExact = exact.filter((k) => !have.has(k));
    const unknown = branch.keys.filter((k) => !ARABIC_PLURAL.includes(k) && !/^=\d+$/.test(k));
    if (missing.length || missingExact.length || unknown.length) {
      add(
        "plural-forms",
        `{${branch.arg}} missing [${[...missing, ...missingExact].join(",")}] unknown [${unknown.join(",")}]`,
      );
    }
  }
  if (arShape.hashInPlural) add("hash-plural", "'#' inside a plural");

  checkIsolationMarks(ar, add);
  const bare = arShape.simple.filter(
    (s) => !s.exempt && !(ar[s.start - 1] === FSI && ar[s.end] === PDI),
  );
  if (bare.length)
    add("bidi-isolate", `not isolated: ${[...new Set(bare.map((s) => `{${s.name}}`))].join(" ")}`);
}

function checkIsolationMarks(text, add) {
  let depth = 0;
  for (const ch of text) {
    if (ch === FSI) depth++;
    else if (ch === PDI) {
      depth--;
      if (depth < 0) break;
    }
  }
  if (depth !== 0) add("bidi-isolate", "unbalanced U+2068/U+2069");
}

/** Returns lines for the whole catalog. */
export function validateCatalog(en, ar, opts = {}) {
  const issues = [];
  const enKeys = Object.keys(en);
  const arKeys = Object.keys(ar);
  const enSet = new Set(enKeys);
  const arSet = new Set(arKeys);
  for (const k of enKeys) if (!arSet.has(k)) issues.push(`${k} missing-key not in ar`);
  for (const k of arKeys) if (!enSet.has(k)) issues.push(`${k} extra-key not in en`);
  const enCommon = enKeys.filter((k) => arSet.has(k));
  const arCommon = arKeys.filter((k) => enSet.has(k));
  const firstDiff = enCommon.findIndex((k, idx) => k !== arCommon[idx]);
  if (firstDiff !== -1)
    issues.push(
      `${arCommon[firstDiff]} key-order expected ${enCommon[firstDiff]} at position ${firstDiff}`,
    );
  for (const k of enCommon) issues.push(...validateEntry(k, en[k], ar[k], opts));
  return issues;
}

/**
 * Reads forbidden translations from a glossary markdown table: the column whose
 * header contains «ممنوع» lists variants (separated by ، , ؛ ; /); the term is
 * taken from the column headed with English/الإنجليزي/المصطلح (else the first column).
 */
export function parseGlossary(text) {
  const forbidden = [];
  let termCol = 0;
  let banCol = -1;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) {
      banCol = -1;
      continue;
    }
    const cells = line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
    const ban = cells.findIndex((c) => c.includes("ممنوع"));
    if (ban !== -1) {
      banCol = ban;
      const t = cells.findIndex((c) => /english|الإنجليزي|الانجليزي|المصطلح/i.test(c));
      termCol = t === -1 ? 0 : t;
      continue;
    }
    if (banCol === -1 || banCol >= cells.length) continue;
    const clean = (s) => s.replace(/[`*_]/g, "").trim();
    const term = clean(cells[termCol] ?? "");
    if (!term) continue;
    for (const variant of cells[banCol].split(/[،,؛;/]/).map(clean)) {
      if (variant && variant !== "-" && variant !== "—") forbidden.push({ term, variant });
    }
  }
  return forbidden;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[++i];
  }
  return out;
}

function main(argv) {
  const here = NodePath.dirname(NodeURL.fileURLToPath(import.meta.url));
  const root = NodePath.resolve(here, "..", "..");
  const args = parseArgs(argv);
  let { en, ar, glossary } = args;
  if (args.app) {
    const dir = NodePath.join(root, "apps", args.app, "src", "i18n", "translations");
    en ??= NodePath.join(dir, "en.json");
    ar ??= NodePath.join(dir, "ar.json");
    glossary ??= NodePath.join(root, "docs", "arabic", "glossary.md");
  }
  if (!en || !ar) {
    console.error(
      "usage: validate-catalog.mjs --en <en.json> --ar <ar.json> [--glossary <md>] [--report <file>] | --app web|desktop",
    );
    return 2;
  }
  const keepPath = NodePath.join(here, "keep-english.json");
  const keepEnglish = new Set(
    NodeFS.existsSync(keepPath) ? JSON.parse(NodeFS.readFileSync(keepPath, "utf8")) : [],
  );
  let forbidden = [];
  if (glossary) {
    if (NodeFS.existsSync(glossary))
      forbidden = parseGlossary(NodeFS.readFileSync(glossary, "utf8"));
    else console.error(`glossary not found, skipping glossary-forbidden: ${glossary}`);
  }
  const enJson = JSON.parse(NodeFS.readFileSync(en, "utf8"));
  const arJson = JSON.parse(NodeFS.readFileSync(ar, "utf8"));
  const issues = validateCatalog(enJson, arJson, { keepEnglish, forbidden });
  if (args.report)
    NodeFS.writeFileSync(args.report, `${issues.join("\n")}${issues.length ? "\n" : ""}`);
  if (issues.length === 0) {
    console.log(`OK ${Object.keys(enJson).length} keys`);
    return 0;
  }
  console.log(issues.join("\n"));
  return 1;
}
const entry = process.argv[1];
if (entry && import.meta.url === NodeURL.pathToFileURL(NodePath.resolve(entry)).href) {
  process.exitCode = main(process.argv.slice(2));
}
