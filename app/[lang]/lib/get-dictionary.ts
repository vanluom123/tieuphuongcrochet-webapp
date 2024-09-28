import { Locale } from "@/i18n.config";
import "server-only";
// import '../../../dictionaries/vi-VN'
// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import("../../../dictionaries/en-US").then((module) => module.default),
  vi: () => import("../../../dictionaries/vi-VN").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.vi();