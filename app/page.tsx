import { getTranslations } from 'next-intl/server';
import styles from './ui/home.module.css';

export default async function Home() {
  const t = await getTranslations('Home');

  return (
    <div className={styles.page}>
      <p>
        This text is rendered on the server:{" "}
        {t('title')}
      </p>
    </div>
  );
}
