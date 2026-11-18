import * as NodeTest from "node:test";
import * as NodeAssert from "node:assert/strict";
import { icuShape, parseGlossary, validateEntry } from "./validate-catalog.mjs";

const FSI = String.fromCodePoint(0x2068);
const PDI = String.fromCodePoint(0x2069);

const opts = { keepEnglish: new Set(), forbidden: [{ term: "thread", variant: "خيط" }] };
const rules = (en, ar) => validateEntry("k", en, ar, opts).map((line) => line.split(" ")[1]);
const SIX =
  "{count, plural, zero {لا ملفات} one {ملف واحد} two {ملفان} few {{count} ملفات} many {{count} ملفًا} other {{count} ملف}}";
const EN_PLURAL = "{count, plural, one {{count} file} other {{count} files}}";

NodeTest.test("icuShape reads args and branches", () => {
  NodeAssert.deepEqual(icuShape(EN_PLURAL), {
    args: ["count"],
    branches: [{ arg: "count", kind: "plural", keys: ["one", "other"] }],
  });
});
NodeTest.test("quoted braces are not arguments", () => {
  NodeAssert.deepEqual(icuShape("Use '{'name'}' and ''{name}''").args, ["name"]);
});
NodeTest.test("six Arabic plural forms pass", () =>
  NodeAssert.deepEqual(rules(EN_PLURAL, SIX), []),
);
NodeTest.test("missing plural form", () =>
  NodeAssert.deepEqual(rules(EN_PLURAL, "{count, plural, one {ملف} other {{count} ملف}}"), [
    "plural-forms",
  ]),
);
NodeTest.test("=1 branch must survive", () =>
  NodeAssert.ok(
    rules(
      "{n, plural, =1 {View browser} other {View {n} browsers}}",
      SIX.replaceAll("count", "n"),
    ).includes("plural-forms"),
  ),
);
NodeTest.test("renamed placeholder", () =>
  NodeAssert.deepEqual(rules("Open {path}", `افتح ${FSI}{file}${PDI}`), ["args-differ"]),
);
NodeTest.test("select keys must match", () =>
  NodeAssert.deepEqual(
    rules("{kind, select, pr {PR} other {change}}", "{kind, select, other {تغيير}}"),
    ["select-keys-differ"],
  ),
);
NodeTest.test("Arabic-Indic digits", () =>
  NodeAssert.deepEqual(rules("Step 2", "الخطوة ٢"), ["arabic-digits"]),
);
NodeTest.test("unisolated placeholder", () =>
  NodeAssert.deepEqual(rules("Open {path}", "افتح {path}"), ["bidi-isolate"]),
);
NodeTest.test("untranslated", () =>
  NodeAssert.deepEqual(rules("Discard draft", "Discard draft"), ["untranslated"]),
);
NodeTest.test("placeholders-only string may stay", () =>
  NodeAssert.deepEqual(rules("{time}, {date}", `${FSI}{time}${PDI}, ${FSI}{date}${PDI}`), []),
);
NodeTest.test("forbidden glossary variant", () =>
  NodeAssert.deepEqual(rules("New thread", "خيط جديد"), ["glossary-forbidden"]),
);
NodeTest.test("JSX entry keeps its objects", () => {
  const en = ["Clone ", { i: 1, k: "_gt_value_1", v: "v" }, " now."];
  NodeAssert.deepEqual(rules(en, ["انسخ ", { i: 1, k: "_gt_value_1", v: "v" }, " الآن."]), []);
  NodeAssert.deepEqual(rules(en, ["انسخ الآن."]), ["jsx-structure"]);
});

NodeTest.test("a dropped plural is rejected", () => {
  NodeAssert.ok(rules(EN_PLURAL, `${FSI}{count}${PDI} ملفات`).includes("plural-forms"));
  NodeAssert.ok(
    rules(EN_PLURAL, "{count, selectordinal, other {{count} ملف}}").includes("plural-forms"),
  );
});
NodeTest.test("an empty translation is rejected", () => {
  NodeAssert.deepEqual(rules("Save", ""), ["empty"]);
  NodeAssert.ok(rules("Save", "  ").includes("empty"));
  const en = ["Clone ", { i: 1, k: "_gt_value_1", v: "v" }, " now."];
  NodeAssert.ok(rules(en, [{ i: 1, k: "_gt_value_1", v: "v" }]).includes("empty"));
});
NodeTest.test("untranslated is seen through the isolates the merge adds", () =>
  NodeAssert.ok(rules("Discard {name}", `Discard ${FSI}{name}${PDI}`).includes("untranslated")),
);
NodeTest.test("JSX fingerprint covers children and data", () => {
  const withChild = [{ t: "a", i: 1, c: ["Open docs"] }];
  NodeAssert.deepEqual(rules(withChild, [{ t: "a", i: 1, c: ["افتح"] }]), []);
  NodeAssert.ok(rules(withChild, [{ t: "a", i: 1 }]).includes("jsx-structure"));
  const withData = [{ t: "Branch", i: 1, d: { b: { mr: "MR" }, t: "b" }, c: "PR" }];
  NodeAssert.deepEqual(
    rules(withData, [{ t: "Branch", i: 1, d: { b: { mr: "MR" }, t: "b" }, c: "طلب" }]),
    [],
  );
  NodeAssert.deepEqual(rules(withData, [{ t: "Branch", i: 1, c: "طلب" }]), ["jsx-structure"]);
});
NodeTest.test("forbidden word is caught with Arabic proclitics", () => {
  for (const ar of ["الخيط", "والخيط", "بالخيط", "للخيط", "فالخيط", "وخيط"]) {
    NodeAssert.deepEqual(rules("New thread", ar), ["glossary-forbidden"], ar);
  }
  NodeAssert.deepEqual(rules("New thread", "خيطان"), []);
});
NodeTest.test("parseGlossary reads the forbidden column from a real header only", () => {
  const md = [
    "| English | العربية | ممنوع | ملاحظة |",
    "|---|---|---|---|",
    "| thread | محادثة | خيط، سلسلة | الكلمة «ممنوع» استعمالها |",
    "| agent | وكيل | عميل | |",
    "",
    "| term | ملاحظة |",
    "|---|---|",
    "| other | هذا ممنوع |",
  ].join("\n");
  NodeAssert.deepEqual(parseGlossary(md), [
    { term: "thread", variant: "خيط" },
    { term: "thread", variant: "سلسلة" },
    { term: "agent", variant: "عميل" },
  ]);
});
