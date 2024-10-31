'use client';

import { Button, Result } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTE_PATH } from "./lib/constant";

const ErrorPage = () => {
  const t = useTranslations('Error');

  return (
    <Result
      status='500'
      title={t('title')}
      subTitle={t('description')}
      extra={
        <Button className='btn-border' type="primary">
          <Link href={ROUTE_PATH.HOME}>{t('back_home')}</Link>
        </Button>
      }
    />
  );
};

export default ErrorPage;