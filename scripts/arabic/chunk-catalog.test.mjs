import * as NodeTest from "node:test";
import * as NodeAssert from "node:assert/strict";
import { isolatePlaceholders, mergeChunks, splitCatalog } from "./chunk-catalog.mjs";

const en = { a: "A", b: "B", c: "C" };
NodeTest.test("split keeps order and size", () =>
  NodeAssert.deepEqual(splitCatalog(en, 2), [{ a: "A", b: "B" }, { c: "C" }]),
);
NodeTest.test("merge restores en order", () =>
  NodeAssert.deepEqual(Object.keys(mergeChunks(en, [{ c: "ج" }, { b: "ب", a: "أ" }])), [
    "a",
    "b",
    "c",
  ]),
);
NodeTest.test("merge rejects a missing key", () =>
  NodeAssert.throws(() => mergeChunks(en, [{ a: "أ" }])),
);
NodeTest.test("merge rejects an unknown key", () =>
  NodeAssert.throws(() => mergeChunks(en, [{ a: "أ", b: "ب", c: "ج", d: "د" }])),
);
NodeTest.test("isolate wraps simple placeholders once", () => {
  const once = isolatePlaceholders("افتح {path}");
  NodeAssert.equal(once, "افتح ⁨{path}⁩");
  NodeAssert.equal(isolatePlaceholders(once), once);
});
NodeTest.test("isolate leaves a plural and its own count alone", () => {
  const plural = "{count, plural, other {{count} ملف}}";
  NodeAssert.equal(isolatePlaceholders(plural), plural);
});
NodeTest.test("isolate still wraps other placeholders inside a plural", () =>
  NodeAssert.equal(
    isolatePlaceholders("{count, plural, other {{count} ملف في {path}}}"),
    "{count, plural, other {{count} ملف في ⁨{path}⁩}}",
  ),
);
