'use client'

import { Flex, Tooltip, Button, theme } from "antd";
import { AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import { useTranslations } from "next-intl";
import { TDirection } from "@/app/lib/definitions";

interface DirectionGroupProps {
    direction: TDirection;
    setDirection: (direction: TDirection) => void;
}
const DirectionGroup = ({ direction, setDirection }: DirectionGroupProps) => {
    const t = useTranslations("Btn");
    const { token } = theme.useToken();

    return (
        <Flex align='center' className='direction-icon'>
            <Tooltip color={token.colorPrimary} title={t("btn_grid")}>
                <Button type="text" onClick={() => setDirection('horizontal')}>
                    <AppstoreOutlined style={{ color: direction === 'horizontal' ? token.colorPrimary : '#707070', fontSize: '24px' }} />
                </Button>
            </Tooltip>
            <Tooltip color={token.colorPrimary} title={t("btn_list")}>
                <Button type="text" onClick={() => setDirection('vertical')}>
                    <MenuOutlined style={{ color: direction === 'vertical' ? token.colorPrimary : '#707070', fontSize: '24px' }} />
                </Button>
            </Tooltip>
        </Flex>
    )
}

export default DirectionGroup;