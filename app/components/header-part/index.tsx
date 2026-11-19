import React from "react";
import { useTranslations } from "next-intl";

interface HeaderPartProps {
  titleId: string;
  descriptionId: string;
  isShowDivider?: boolean;
  actionNode?: React.ReactNode;
  align?: "left" | "center";
}

const HeaderPart = ({
  titleId,
  descriptionId,
  isShowDivider,
  actionNode,
  align = "left",
}: HeaderPartProps) => {
  const t = useTranslations();

  return (
    <div className="header-part responsive text-box">
      {isShowDivider && <hr className="yarn-divider" />}
      {titleId && (
        <div
          className={`header-title ${
            align === "center" ? "is-centered" : ""
          }`}
        >
          <div className="header-title__copy">
            <h2 className="title">{t(titleId)}</h2>
            {descriptionId && <p className="description">{t(descriptionId)}</p>}
          </div>
          {actionNode && (
            <div className="header-part__action">{actionNode}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderPart;
