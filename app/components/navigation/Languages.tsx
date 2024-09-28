import { Dropdown, Button, Space } from "antd"
import { LANGUAGES_LIST } from "../../lib/constant"
import { CaretDownOutlined } from "@ant-design/icons"
import { useState, useTransition } from "react";
import { useLocale } from "use-intl";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/app/lib/service/locale";

const Languages = () => {
    const locale = useLocale();
    const [isOpenLang, setIsOpenLang] = useState(false);
    const [, startTransition] = useTransition();

    const getLabel = (key: string) => {
        const item = LANGUAGES_LIST.find(l => key === l?.key);
        return item?.label || locale;
    }

    const switchLanguage = (lang: { key: string }) => {
        const locale = lang.key as Locale;
        startTransition(() => {
            setUserLocale(locale);
        });

    }

    const onOpenChange = (open: boolean) => {
        setIsOpenLang(open);
    }
    return (
        <Dropdown
            trigger={['click']}
            menu={{
                items: LANGUAGES_LIST,
                onClick: (item) => switchLanguage(item)
            }}
            onOpenChange={onOpenChange}
        >
            <Button type='text' className='btn-lang'>
                <Space>
                    {getLabel(locale)}
                    <CaretDownOutlined className={isOpenLang ? 'transition-transform rote-180' : 'transition-transform'} />
                </Space>
            </Button>
        </Dropdown>
    )
}

export default Languages;