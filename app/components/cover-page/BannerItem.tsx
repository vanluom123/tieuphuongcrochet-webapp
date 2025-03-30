import { Button } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Banner } from "@/app/lib/definitions";
import CustomNextImage from "../next-image";


interface BannerItemProps {
	banner: Banner,
	classNames?: string,
};

const BannerItem = ({ banner, classNames }: BannerItemProps) => {
	const { fileContent, title, content, url, textColor } = banner;
	const t = useTranslations("Btn");
    
	return (
		<div className={`banner-item ${classNames ? classNames : ''}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
			{fileContent && (
				<div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
					<CustomNextImage 
						src={fileContent} 
						alt={title || "Banner"}
						className="banner-image"
						aspectRatio="56.25%"
					/>
				</div>
			)}
			<div className='banner-item__infor' style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'rgba(0,0,0,0.5)' }}>
				{title && (
					<h4 style={{ color: textColor ? textColor : '#FFFFFF', margin: '0 0 5px 0' }} className='title'>
						{title}
					</h4>
				)}
				{content && (
					<h5 style={{ color: textColor ? textColor : '#FFFFFF', margin: '0 0 5px 0' }} className='content'>{content}</h5>
				)}
				{url && <Link href={url} >
					<Button className='btn-view' type='primary' size="small">
						{t('btn_view_detail')}  
					</Button>
				</Link>}
			</div>
		</div>
	)
};

export default BannerItem;
