import { Button, Result } from "antd";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTE_PATH } from "@/app/lib/constant";

export const generateMetadata = async () => {
  const t = await getTranslations('NotFound');

  return {
    title: t('title'),
  }
}

const NotFound = async () => {
    const t = await getTranslations('NotFound');

  return (
    <Result
      status="404"
      title={t('title')}
      subTitle={t('description')}
      extra={
        <Button className='btn-border' type="primary">
          <Link href={ROUTE_PATH.HOME}>{t('back_home')}</Link>
        </Button>
      }
    />
  );
}

export default NotFound;