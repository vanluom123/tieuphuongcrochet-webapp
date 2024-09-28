import { useParams } from 'next/navigation';
import { getDictionary } from './get-dictionary';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export function useTranslation() {
  const { lang } = useParams();
  const dictionary = getDictionary(lang as 'vi' | 'en');
  
  return {
    t: (key: keyof Dictionary) => dictionary.then(dict => dict[key] || key),
    lang,
  };
}