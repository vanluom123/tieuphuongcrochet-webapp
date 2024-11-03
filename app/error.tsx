'use client'
import { Button, Result } from "antd";
import { getTranslations } from "next-intl/server";

import { useEffect } from "react";

export const generateMetadata = async () => {
  const t = await getTranslations('Error');

  return {
    title: t('title'),
  }
}

const Error = async ({ error, reset }: {error: Error, reset: () => void }) => {
    const t = await getTranslations('Error');
    useEffect(() => {
      // Log the error to an error reporting service
      console.error(error)
    }, [error]);

  return (
    <Result
      status="500"
      title={t('title')}
      subTitle={t('description')}
      extra={
          <Button className='btn-border' type="primary"
          onClick={
            () => reset()
          }
        >
          {t('try_again')}
        </Button>
      }
    />
  );
}

export default Error;