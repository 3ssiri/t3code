import { describe, expect, it } from "vite-plus/test";

import { localeDirection } from "./locales";

describe("localeDirection", () => {
  it.each([
    ["ar", "rtl"],
    ["ar-SA", "rtl"],
    ["AR", "rtl"],
    ["fa", "rtl"],
    ["he", "rtl"],
    ["ur", "rtl"],
    ["en", "ltr"],
    ["pt-BR", "ltr"],
    ["arn", "ltr"],
    ["", "ltr"],
  ] as const)("%s reads %s", (locale, direction) => {
    expect(localeDirection(locale)).toBe(direction);
  });
});
