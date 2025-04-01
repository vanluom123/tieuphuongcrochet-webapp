import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from '@/app/lib/service/locale';
import {locales} from './config';

// Keep track of missing translations
const missingTranslations = new Set<string>();

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  
  // Load all locale messages
  const messages = (await import(`./locales/${locale}.json`)).default;
  
  // In development, check for missing translations in other locales
  if (process.env.NODE_ENV === 'development') {
    // This will only run once during server startup
    try {
      // Load all translation files to compare
      const allMessages = await Promise.all(
        locales.map(async (loc) => ({
          locale: loc,
          messages: (await import(`./locales/${loc}.json`)).default
        }))
      );
      
      // Compare all keys across locales
      const allKeys = new Set<string>();
      
      // Function to collect all keys (including nested ones)
      const collectKeys = (obj: any, prefix = '') => {
        for (const key in obj) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            collectKeys(obj[key], fullKey);
          } else {
            allKeys.add(fullKey);
          }
        }
      };
      
      // Collect all keys from all locales
      allMessages.forEach(({messages}) => collectKeys(messages));
      
      // Check that all keys exist in all locales
      allKeys.forEach(key => {
        allMessages.forEach(({locale, messages}) => {
          const parts = key.split('.');
          let current = messages;
          let exists = true;
          
          for (const part of parts) {
            if (!current || current[part] === undefined) {
              exists = false;
              break;
            }
            current = current[part];
          }
          
          if (!exists && !missingTranslations.has(`${locale}:${key}`)) {
            missingTranslations.add(`${locale}:${key}`);
            console.warn(`Missing translation for key "${key}" in locale "${locale}"`);
          }
        });
      });
    } catch (error) {
      console.error('Error checking translations:', error);
    }
  }

  return {
    locale,
    messages
  };
});