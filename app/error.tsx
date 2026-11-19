"use client";
import { Button, Result } from "antd";
import { useTranslations } from "next-intl";

import { useEffect } from "react";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  const t = useTranslations("Error");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="status-result-card">
      <Result
        status="500"
        title={t("title")}
        subTitle={t("description")}
        extra={
          <Button
            className="btn-border"
            type="primary"
            onClick={() => reset()}
          >
            {t("try_again")}
          </Button>
        }
      />
    </div>
  );
};

export default Error;
