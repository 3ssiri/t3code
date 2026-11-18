export const SYSTEM_LANGUAGE = "system";

// Shown in their own language so a user can find theirs from any UI language.
const NATIVE_LANGUAGE_NAMES: Readonly<Record<string, string>> = {
  en: "English",
  ar: "العربية",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  ja: "日本語",
  ko: "한국어",
  "pt-BR": "Português (Brasil)",
  ru: "Русский",
  sv: "Svenska",
  zh: "中文（简体）",
};

const RTL_LANGUAGES: ReadonlySet<string> = new Set(["ar", "fa", "he", "ur"]);

/** Reading direction of a locale tag, matched on its language subtag. */
export function localeDirection(locale: string): "ltr" | "rtl" {
  const language = locale.trim().toLowerCase().split(/[-_]/)[0] ?? "";
  return RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
}

export function nativeLanguageName(locale: string): string {
  return NATIVE_LANGUAGE_NAMES[locale] ?? locale;
}

// Our `zh` is Simplified, so Traditional tags only match an exact locale.
const TRADITIONAL_CHINESE = /^zh[-_](hant|tw|hk|mo)\b/;

function matchSupportedLocale(tag: string, supported: ReadonlyArray<string>): string | undefined {
  const normalized = tag.trim().toLowerCase();
  const language = normalized.split(/[-_]/)[0];
  const exact = supported.find((locale) => locale.toLowerCase() === normalized);
  if (exact || TRADITIONAL_CHINESE.test(normalized)) return exact;
  return supported.find((locale) => locale.toLowerCase() === language);
}

/** Saved setting to active locale; "system" and unknown values follow the host's languages. */
export function resolveLocale(
  language: string,
  systemLocales: ReadonlyArray<string>,
  supported: ReadonlyArray<string>,
  fallback: string,
): string {
  if (supported.includes(language)) return language;
  for (const tag of systemLocales) {
    const match = matchSupportedLocale(tag, supported);
    if (match) return match;
  }
  return fallback;
}
