import { Flex, Tooltip, Button } from "antd";
import { AppstoreOutlined, MenuOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { TDirection } from "@/app/lib/definitions";

interface DirectionGroupProps {
  direction: TDirection;
  setDirection: (direction: TDirection) => void;
}

const DirectionGroup = ({ direction, setDirection }: DirectionGroupProps) => {
  const t = useTranslations("Btn");

  return (
    <Flex align="center" gap={4} className="direction-icon">
      <Tooltip title={t("btn_grid")}>
        <Button
          type="text"
          aria-label={t("btn_grid")}
          aria-pressed={direction === "horizontal"}
          className={`direction-btn ${
            direction === "horizontal" ? "is-active" : ""
          }`}
          onClick={() => setDirection("horizontal")}
          icon={<AppstoreOutlined />}
        />
      </Tooltip>
      <Tooltip title={t("btn_list")}>
        <Button
          type="text"
          aria-label={t("btn_list")}
          aria-pressed={direction === "vertical"}
          className={`direction-btn ${
            direction === "vertical" ? "is-active" : ""
          }`}
          onClick={() => setDirection("vertical")}
          icon={<MenuOutlined />}
        />
      </Tooltip>
    </Flex>
  );
};

export default DirectionGroup;
