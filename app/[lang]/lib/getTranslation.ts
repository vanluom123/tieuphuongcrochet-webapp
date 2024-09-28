import { getDictionary } from './get-dictionary';

export async function getTranslations(lang: string) {
  const dictionary = await getDictionary(lang as 'vi' | 'en');
  
  return {
    t: (key: keyof typeof dictionary) => dictionary[key] || key,
    lang,
  };
}