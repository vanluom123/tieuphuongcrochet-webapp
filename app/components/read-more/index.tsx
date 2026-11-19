import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import styles from "../../ui/components/btnReadMore.module.scss";

interface ReadMoreBtnProps {
  path: string;
  className?: string;
}

const ReadMoreBtn = ({ path, className = "" }: ReadMoreBtnProps) => {
  const t = useTranslations("Btn");
  const classes = `${styles.readmoreBtn} ${className}`.trim();

  return (
    <div className={classes}>
      <Link href={path}>{t("readMore")}</Link>
    </div>
  );
};

export default ReadMoreBtn;
