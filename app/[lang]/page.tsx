import styles from './ui/home.module.css';
import { Locale } from "@/i18n.config";
import { getTranslations } from './lib/getTranslation';

export default async function Home(
  { params: { lang }, }: {
    params: { lang: Locale };
  }) {
  const { t } = await getTranslations(lang);

  return (
    <div className={styles.page}>
      <p>Current locale: {lang}</p>
      <p>
        This text is rendered on the server:{" "}
        {t('contact_title')}
      </p>
    </div>
  );
}
