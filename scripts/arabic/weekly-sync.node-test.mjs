import * as NodeTest from "node:test";
import * as NodeAssert from "node:assert/strict";
import { daysLeft, pickTarget, reconcileCatalog, untranslatedKeys } from "./weekly-sync.mjs";

NodeTest.test("target follows the PR state", () => {
  NodeAssert.equal(pickTarget("MERGED"), "upstream/main");
  NodeAssert.equal(pickTarget("OPEN"), "upstream/t3/i18n-translate-all-languages");
});
NodeTest.test("new keys are the ones still in English", () =>
  NodeAssert.deepEqual(
    untranslatedKeys(
      { a: "Save", b: "URL", c: "Open", d: ["x", { n: 1 }], e: ["y"] },
      { a: "احفظ", b: "URL", c: "Open", d: ["x", { n: 1 }], e: ["ي"] },
      new Set(["b"]),
    ),
    ["c", "d"],
  ),
);
NodeTest.test("two-week window", () => {
  NodeAssert.equal(daysLeft(null, "2026-12-01"), null);
  NodeAssert.equal(daysLeft("2026-11-20", "2026-11-27"), 7);
  NodeAssert.equal(daysLeft("2026-11-20", "2026-12-10"), -6);
});
NodeTest.test("reconcile adds new keys, drops stale ones, follows en order", () => {
  const merged = reconcileCatalog({ a: "A", b: "B", c: "C" }, { c: "ج", old: "x", a: "أ" });
  NodeAssert.deepEqual(Object.entries(merged), [
    ["a", "أ"],
    ["b", "B"],
    ["c", "ج"],
  ]);
});
