import { Card, Image } from 'antd';
import Meta from 'antd/es/card/Meta';
import React from 'react';

import logo from '@/public/logo.png';
import { StaticImageData } from 'next/image';
import { SOCIAL_LINKS } from '@/app/lib/constant';

import '../../ui/components/socialBox.scss';

interface SocialBoxProps {
	textColor?: string;
	src?: StaticImageData;
	social: string;
	url?: string;
	description?: string;
}

const SocialBox = ({ textColor, src, social, url, description }: SocialBoxProps) => {
	return (
		<a
			href={url || SOCIAL_LINKS.FACEBOOK}
			target="_blank"
			rel="noreferrer"
			className='card-social'
		>
			<Card
				className='card-item'
				bordered={false}
				hoverable
				cover={
					<Image
						preview={false}
						alt={social || 'Tiệm len Tiểu Phương'}
						src={src?.src || logo.src} />
				}
			>
				<Meta title={<span style={{ color: textColor || '#333' }}>{social}</span>}
					description={description} />
			</Card>
		</a>
	)
}

export default SocialBox;