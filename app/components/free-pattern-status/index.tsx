import { Segmented } from "antd"
import { map } from 'lodash';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { SegmentedValue } from "antd/es/segmented";
import { useTranslations } from "next-intl";

import { TranslationStatus, TTranslationStatus } from "@/app/lib/definitions";
import { TRANSLATION_STATUS_COLOR } from "@/app/lib/constant";
import { getStatusColor } from "@/app/lib/utils";

interface PatternStatusProps {
    options: TranslationStatus[];
    defaultValue?: string;
    size?: 'large' | 'middle' | 'small';
    onChange?: (value: SegmentedValue) => void;
    className?: string;
    value?: SegmentedValue;
}

export const getIconTag = (status: TTranslationStatus) => {
    if (status === 'SUCCESS') {
        return <CheckCircleOutlined color={getStatusColor(status)}/>
    }
    return status === 'PENDING' ? <SyncOutlined /> : <ClockCircleOutlined />
}

const FreePatternStatus = ({ size = 'large', defaultValue, options, onChange, className, value }: PatternStatusProps) => {

    const t = useTranslations("FreePattern");


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
