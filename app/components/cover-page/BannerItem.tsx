import { Button, Image } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Banner } from "@/app/lib/definitions";


interface BannerItemProps {
	banner: Banner,
	classNames?: string,
};

const BannerItem = ({ banner, classNames }: BannerItemProps) => {
	const { fileContent, title, content, url, textColor } = banner;
	const t = useTranslations("Btn");
    
	return (
		<div className={`banner-item ${classNames ? classNames : ''}`}>
			{fileContent && <Image preview={false} src={fileContent} alt='Banner 1' />}
			<div className='banner-item__infor'>
				<h4 style={{ color: textColor ? textColor : '#FFFFFF' }} className='title'>
					{title}
				</h4>
				<h5 style={{ color: textColor ? textColor : '#FFFFFF' }} className='content'>{content}</h5>
				{url && <Link href={url} >
					<Button className='btn-view' type='primary'>
						{t('btn_view_detail')}  
					</Button>
				</Link>}
			</div>
		</div>
	)
};

export default BannerItem;
