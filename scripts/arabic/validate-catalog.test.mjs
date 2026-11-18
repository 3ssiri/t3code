import * as NodeTest from "node:test";
import * as NodeAssert from "node:assert/strict";
import { icuShape, validateEntry } from "./validate-catalog.mjs";

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
  NodeAssert.deepEqual(rules("Open {path}", "افتح ⁨{file}⁩"), ["args-differ"]),
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
  NodeAssert.deepEqual(rules("{time}, {date}", "⁨{time}⁩, ⁨{date}⁩"), []),
);
NodeTest.test("forbidden glossary variant", () =>
  NodeAssert.deepEqual(rules("New thread", "خيط جديد"), ["glossary-forbidden"]),
);
NodeTest.test("JSX entry keeps its objects", () => {
  const en = ["Clone ", { i: 1, k: "_gt_value_1", v: "v" }, " now."];
  NodeAssert.deepEqual(rules(en, ["انسخ ", { i: 1, k: "_gt_value_1", v: "v" }, " الآن."]), []);
  NodeAssert.deepEqual(rules(en, ["انسخ الآن."]), ["jsx-structure"]);
});
