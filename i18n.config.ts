export const i18n = {
  locales: ["vi", "en"],
  defaultLocale: "vi",
} as const;

export type Locale = (typeof i18n)["locales"][number];