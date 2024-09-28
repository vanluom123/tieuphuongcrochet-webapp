import { Dropdown, Button, Space } from "antd"
import { LANGUAGES_LIST } from "../../lib/constant"
import { CaretDownOutlined } from "@ant-design/icons"
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Locale } from "@/i18n.config";
import Link from "next/link";

const Languages = () => {
    const [isOpenLang, setIsOpenLang] = useState(false);
    const { lang } = useParams();
    const pathName = usePathname();

    const getLabel = (key: string) => {
        const item = LANGUAGES_LIST.find(l => key === l?.key);
        return item?.label || lang;
    }

    const redirectedPathName = (locale: Locale) => {
      if (!pathName) return "/";
      const segments = pathName.split("/");
      segments[1] = locale;
      return segments.join("/");
    };

    const onOpenChange = (open: boolean) => {
        setIsOpenLang(open);
    };
    return (
        <Dropdown
            trigger={['click']}
            menu={{
                items: LANGUAGES_LIST.map(item => ({
                    key: item?.key,
                    label: <Link href={redirectedPathName(item?.key as Locale)}>{item?.label}</Link>,
                })),
            }}
            onOpenChange={onOpenChange}
        >
            <Button type='text' className='btn-lang'>
                <Space>
                    {getLabel(lang as string)}
                    <CaretDownOutlined className={isOpenLang ? 'transition-transform rote-180' : 'transition-transform'} />
                </Space>
            </Button>
        </Dropdown>
    )
}

export default Languages;