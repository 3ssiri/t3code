import * as NodeFS from "node:fs";
import * as NodePath from "node:path";
import * as NodeURL from "node:url";
import * as NodeChildProcess from "node:child_process";
import { parseGlossary, validateCatalog } from "./validate-catalog.mjs";

const here = NodePath.dirname(NodeURL.fileURLToPath(import.meta.url));
const root = NodePath.resolve(here, "..", "..");
const STATE_FILE = NodePath.join(here, "sync-state.json");
const PROGRESS_FILE = NodePath.join(root, "docs", "arabic", "PROGRESS.md");
const GLOSSARY_FILE = NodePath.join(root, "docs", "arabic", "glossary.md");
const PR = "37893";
const BRANCH_TARGET = "upstream/t3/i18n-translate-all-languages";
const MAIN_TARGET = "upstream/main";
const WINDOW_DAYS = 14;
const MAX_LISTED = 200;
const APPS = ["web", "desktop"];

// Exit codes: 1 dirty tree, 2 merge conflict, 3 rewritten upstream branch,
// 4 i18n:check failed, 5 an external command failed, 6 not on the arabic branch,
// 7 recorded sha unknown to git, 8 unexpected error, 9 push failed (local commit kept),
// 10 merge failed without conflicts, 11 rollback failed (manual recovery needed).
export function pickTarget(prState) {
  return prState === "MERGED" ? MAIN_TARGET : BRANCH_TARGET;
}

export function untranslatedKeys(en, ar, keepEnglish) {
  return Object.keys(en).filter(
    (key) => JSON.stringify(ar[key]) === JSON.stringify(en[key]) && !keepEnglish.has(key),
  );
}

export function daysLeft(commentDate, today) {
  if (!commentDate) return null;
  const elapsed = (Date.parse(today) - Date.parse(commentDate)) / 86_400_000;
  return WINDOW_DAYS - elapsed;
}

/** Same keys and order as en; existing ar values kept, missing ones take the English value. */
export function reconcileCatalog(en, ar) {
  const out = {};
  for (const key of Object.keys(en)) out[key] = Object.hasOwn(ar, key) ? ar[key] : en[key];
  return out;
}

export function renderReport({ date, target, sha, newKeys, daysLeft: left, issues = [] }) {
  const listed = newKeys.slice(0, MAX_LISTED);
  const lines = [
    "## آخر مزامنة",
    "",
    `- التاريخ: ${date}`,
    `- الهدف: \`${target}\` عند \`${sha}\``,
    `- عدد المفاتيح الجديدة بلا ترجمة: ${newKeys.length}`,
    left === null
      ? "- مهلة الرد: لم تبدأ (لم يُنشر التعليق بعد)."
      : `- الأيام الباقية من مهلة الرد: ${left}`,
    `- ملاحظات الفاحص: ${issues.length}`,
  ];
  if (issues.length > 0) {
    lines.push("", `أول ${Math.min(issues.length, 20)} ملاحظة (التطبيق والمفتاح والقاعدة):`, "");
    for (const issue of issues.slice(0, 20)) {
      const [key, rule] = issue.line.split(" ");
      lines.push(`- \`${issue.app}:${key}\` — ${rule}`);
    }
  }
  if (listed.length > 0) {
    lines.push(
      "",
      newKeys.length > listed.length
        ? `أول ${listed.length} مفتاح (المفتاح والنص الإنجليزي):`
        : "المفاتيح (المفتاح والنص الإنجليزي):",
      "",
    );
    for (const { app, key, en } of listed) {
      lines.push(`- \`${app}:${key}\` — ${JSON.stringify(en)}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function run(command) {
  const result = NodeChildProcess.spawnSync(command, {
    cwd: root,
    shell: true,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: (result.stdout ?? "").trim(),
    out: `${result.stdout ?? ""}${result.stderr ?? ""}`,
  };
}

class StepError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

function runOrThrow(command, code = 5) {
  const result = run(command);
  if (!result.ok) throw new StepError(`failed: ${command}\n${result.out}`, code);
  return result.out.trim();
}

const catalogPath = (app, locale) =>
  NodePath.join(root, "apps", app, "src", "i18n", "translations", `${locale}.json`);
const readJson = (file) => JSON.parse(NodeFS.readFileSync(file, "utf8"));

function replaceSection(markdown, section) {
  const heading = "## آخر مزامنة";
  const start = markdown.indexOf(heading);
  if (start === -1) return `${markdown.trimEnd()}\n\n${section}`;
  const next = markdown.indexOf("\n## ", start + heading.length);
  const tail = next === -1 ? "" : `\n${markdown.slice(next + 1)}`;
  return `${markdown.slice(0, start)}${section}${tail}`;
}

function mergeAndCommit({ target, state }) {
  const merge = run(`git merge --no-edit ${target}`);
  if (!merge.ok) {
    const conflicts = run("git diff --name-only --diff-filter=U").stdout;
    if (!conflicts)
      throw new StepError(
        `merge failed without conflicts:
${merge.out}`,
        10,
      );
    throw new StepError(
      `merge conflict:
${conflicts}`,
      2,
    );
  }

  runOrThrow("vp i --frozen-lockfile -- --yes");

  const keepPath = NodePath.join(here, "keep-english.json");
  const keepEnglish = new Set(NodeFS.existsSync(keepPath) ? readJson(keepPath) : []);
  const forbidden = NodeFS.existsSync(GLOSSARY_FILE)
    ? parseGlossary(NodeFS.readFileSync(GLOSSARY_FILE, "utf8"))
    : [];
  const newKeys = [];
  const issues = [];
  for (const app of APPS) {
    const en = readJson(catalogPath(app, "en"));
    const ar = reconcileCatalog(en, readJson(catalogPath(app, "ar")));
    NodeFS.writeFileSync(
      catalogPath(app, "ar"),
      `${JSON.stringify(ar, null, 2)}
`,
    );
    for (const line of validateCatalog(en, ar, { keepEnglish, forbidden }))
      issues.push({ app, line });
    for (const key of untranslatedKeys(en, ar, keepEnglish))
      newKeys.push({ app, key, en: en[key] });
  }

  const check = run("vp run i18n:check");
  if (!check.ok) throw new StepError(check.out, 4);

  const date = new Date().toISOString().slice(0, 10);
  const sha = runOrThrow(`git rev-parse ${target}`);
  const report = renderReport({
    date,
    target,
    sha,
    newKeys,
    issues,
    daysLeft: daysLeft(state.commentDate, date),
  });
  NodeFS.writeFileSync(
    PROGRESS_FILE,
    replaceSection(NodeFS.readFileSync(PROGRESS_FILE, "utf8"), report),
  );
  NodeFS.writeFileSync(
    STATE_FILE,
    `${JSON.stringify({ ...state, base: target, sha }, null, 2)}
`,
  );

  const files = [
    ...APPS.map((app) => `apps/${app}/src/i18n/translations/ar.json`),
    "docs/arabic/PROGRESS.md",
    "scripts/arabic/sync-state.json",
  ];
  runOrThrow(`git add ${files.join(" ")}`);
  if (run("git diff --cached --quiet").ok) {
    console.log("nothing to sync");
    return;
  }
  runOrThrow(`git commit -m "chore(arabic): weekly upstream sync ${date}"`);
  const leftover = run("git status --porcelain").out.trim();
  if (leftover)
    throw new StepError(
      `tree not clean after commit:
${leftover}`,
      5,
    );
  console.log(
    `synced ${target}; new untranslated keys: ${newKeys.length}; validator issues: ${issues.length}`,
  );
}

function main(argv) {
  const dryRun = argv.includes("--dry-run");
  const push = argv.includes("--push");

  try {
    if (runOrThrow("git status --porcelain")) throw new StepError("working tree is not clean", 1);
    const branch = runOrThrow("git rev-parse --abbrev-ref HEAD");
    if (branch !== "arabic") throw new StepError(`must run on branch arabic, not ${branch}`, 6);

    runOrThrow("git fetch upstream");
    const prState = JSON.parse(
      runOrThrow(`gh pr view ${PR} -R pingdotgg/t3code --json state`),
    ).state;
    const target = pickTarget(prState);

    const state = readJson(STATE_FILE);
    const ancestry = run(`git merge-base --is-ancestor ${state.sha} ${target}`);
    if (ancestry.status === 1) throw new StepError("الفرع أعيدت كتابته، يلزم نقل يدوي", 3);
    if (!ancestry.ok)
      throw new StepError(
        `cannot check recorded sha:
${ancestry.out}`,
        7,
      );
    if (dryRun) {
      console.log(`target=${target} state=${prState}`);
      return 0;
    }

    const pre = runOrThrow("git rev-parse HEAD");
    try {
      mergeAndCommit({ target, state });
    } catch (error) {
      run("git merge --abort");
      run(`git reset --hard ${pre}`);
      const head = run("git rev-parse HEAD").stdout;
      const dirty = run("git status --porcelain").stdout;
      if (head !== pre || dirty) {
        console.error(`ROLLBACK FAILED: expected HEAD ${pre}, found ${head}; dirty files:
${dirty}`);
        throw new StepError(`rollback failed, manual recovery needed (reset to ${pre})`, 11);
      }
      throw error;
    }
    if (push) {
      const pushed = run("git push origin arabic");
      if (!pushed.ok)
        throw new StepError(
          `push failed (local commit kept):
${pushed.out}`,
          9,
        );
    }
    return 0;
  } catch (error) {
    console.error(error instanceof StepError ? error.message : error);
    return error instanceof StepError ? error.code : 8;
  }
}

if (process.argv[1] && NodeURL.pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exit(main(process.argv.slice(2)));
}
