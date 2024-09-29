import { Segmented } from "antd"
import { map } from 'lodash';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { SegmentedValue } from "antd/es/segmented";
import { TranslationStatus, TTranslationStatus } from "@/app/lib/definitions";
import { TRANSLATION_STATUS_COLOR } from "@/app/lib/constant";
import { useTranslations } from "next-intl";

interface PatternStatusProps {
    options: TranslationStatus[];
    defaultValue: string;
    size?: 'large' | 'middle' | 'small';
    onChange?: (value: SegmentedValue) => void;
    className?: string;
    value?: SegmentedValue;
}

const FreePatternStatus = ({ size = 'large', defaultValue, options, onChange, className, value }: PatternStatusProps) => {

    const t = useTranslations("FreePattern");
    const getIconTag = (status: TTranslationStatus) => {
        if (status === 'SUCCESS') {
            return <CheckCircleOutlined />
        }
        return status === 'PENDING' ? <SyncOutlined /> : <ClockCircleOutlined />
    }

    return (
        <Segmented
            size={size}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            className={className}
            options={map(options, item => (
                {
                    icon: getIconTag(item.value),
                    label: t(`status.${item.label}`),
                    value: item.value,
                    className: TRANSLATION_STATUS_COLOR[item.value]
                }
            ))}
        />
    )
}

export default FreePatternStatus;
