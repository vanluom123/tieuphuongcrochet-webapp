import styles from './ui/home.module.css';
import { Locale } from "@/i18n.config";
import { getDictionary } from "./lib/get-dictionary";

export default async function Home(
  { params: { lang },
  }: {
    params: { lang: Locale };
  }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className={styles.page}>
      <p>Current locale: {lang}</p>
      <p>
        This text is rendered on the server:{" "}
        {dictionary['contact_title']}
      </p>
    </div>
  );
}
