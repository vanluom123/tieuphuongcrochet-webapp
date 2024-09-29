import { Flex, Tooltip, Button } from "antd";
import { AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import { useTranslations } from "next-intl";
import { TDirection } from "@/app/lib/definitions";

interface DirectionGroupProps {
    direction: TDirection;
    setDirection: (direction: TDirection) => void;
}
const DirectionGroup = ({ direction, setDirection }: DirectionGroupProps) => {
    const t = useTranslations("Btn");

    return (
        <Flex align='center' className='direction-icon'>
            <Tooltip color='#fc8282' title={t("btn_grid")}>
                <Button type="text" onClick={() => setDirection('horizontal')}>
                    <AppstoreOutlined style={{ color: direction === 'horizontal' ? '#fc8282' : '#707070', fontSize: '24px' }} />
                </Button>
            </Tooltip>
            <Tooltip color='#fc8282' title={t("btn_list")}>
                <Button type="text" onClick={() => setDirection('vertical')}>
                    <MenuOutlined style={{ color: direction === 'vertical' ? '#fc8282' : '#707070', fontSize: '24px' }} />
                </Button>
            </Tooltip>
        </Flex>
    )
}

export default DirectionGroup;