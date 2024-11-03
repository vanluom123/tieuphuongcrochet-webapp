'use client'
import { Button, Result } from "antd";
import { useTranslations } from "next-intl";

import { useEffect } from "react";

const Error = async ({ error, reset }: {error: Error, reset: () => void }) => {
    const t = useTranslations('Error');
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