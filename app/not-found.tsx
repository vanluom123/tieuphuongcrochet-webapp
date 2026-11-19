import { Button, Result } from "antd";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTE_PATH } from "@/app/lib/constant";

export const generateMetadata = async () => {
  const t = await getTranslations("NotFound");

  return {
    title: t("title"),
  };
};

const NotFound = async () => {
  const t = await getTranslations("NotFound");

  return (
    <div className="status-result-card">
      <Result
        status="404"
        title={t("title")}
        subTitle={t("description")}
        extra={
          <Link href={ROUTE_PATH.HOME}>
            <Button className="btn-border" type="primary">
              {t("back_home")}
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
