import { Dropdown, Button, Space } from "antd"
import { LANGUAGES_LIST } from "../../lib/constant"
import { CaretDownOutlined } from "@ant-design/icons"
import { useState, useTransition, useCallback, useMemo } from "react";
import { useLocale } from "use-intl";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/app/lib/service/locale";

const Languages = () => {
    const locale = useLocale();
    const [isOpenLang, setIsOpenLang] = useState(false);
    const [, startTransition] = useTransition();

    const getLabel = useCallback((key: string) => {
        return LANGUAGES_LIST.find(l => key === l?.key)?.label || locale;
    }, [locale]);

    const switchLanguage = useCallback((lang: { key: string }) => {
        const newLocale = lang.key as Locale;
        startTransition(() => {
            setUserLocale(newLocale);
        });
    }, []);

    const onOpenChange = useCallback((open: boolean) => {
        setIsOpenLang(open);
    }, []);

    const menuItems = useMemo(() => ({
        items: LANGUAGES_LIST,
        onClick: switchLanguage
    }), [switchLanguage]);

    const transformBtn = useMemo(() => 
        isOpenLang ? ' transition-transform rotate-180' : 'transition-transform',
    [isOpenLang]);

    return (
        <Dropdown
            menu={menuItems}
            onOpenChange={onOpenChange}
        >
            <Button type='text' className='btn-lang'>
                <Space>
                    {getLabel(locale)}
                    <CaretDownOutlined className={transformBtn} />
                </Space>
            </Button>
        </Dropdown>
    )
}

export default Languages;