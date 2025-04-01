export type Locale = (typeof locales)[number];

export const locales = ['en', 'vi'] as const;
export const defaultLocale: Locale = 'vi';

// Add a utility function to check if a translation key exists
export function checkTranslationKey(key: string, translations: Record<string, any>): boolean {
  const parts = key.split('.');
  let current = translations;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }
  
  return true;
}