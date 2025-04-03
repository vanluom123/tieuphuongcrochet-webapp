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
		<div className={`banner-item ${classNames ? classNames : ''}`}>
			{fileContent && (
				<div className="banner-image-container">
					<CustomNextImage 
						src={fileContent} 
						alt={title || "Banner"}
						className="banner-image"
						aspectRatio="56.25%"
						objectFit="scale-down"
					/>
				</div>
			)}
			<div className="banner-item__infor">
				{title && (
					<h4 style={{ color: textColor || '#FFFFFF' }} className="title">
						{title}
					</h4>
				)}
				{content && (
					<h5 style={{ color: textColor || '#FFFFFF' }} className="content">{content}</h5>
				)}
				{url && <Link href={url}>
					<Button className="btn-view" type="primary" size="small">
						{t('btn_view_detail')}  
					</Button>
				</Link>}
			</div>
		</div>
	)
};

export default BannerItem;
