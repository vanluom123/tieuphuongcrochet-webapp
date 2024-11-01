import React from 'react';
import { Button, Col, Divider, Flex, Image, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { DataType } from '@/app/lib/definitions';
import { IMAGE_FALLBACK, SOCIAL_LINKS } from '@/app/lib/constant';
import Link from 'next/link';
import FormattedCurrency from '../forrmat-currency';
import '../../ui/components/list-view-item.scss'
import { useTranslations } from 'next-intl';

interface ListViewItemProps {
	data: DataType;
	onPreview?: () => void;
	onShopping?: () => void;
	onReadDetail?: () => void;
	isListView?: boolean;
};

const ListViewItem = (
	{
		data,
		onPreview,
		onReadDetail,
		onShopping,
	}: ListViewItemProps) => {
	const { price, name, src, author, link, description, currency_code, imagesPreview } = data;
	const t = useTranslations('ListViewItem');

	const onClickBtn = () => {
		if (onReadDetail instanceof Function) {
			onReadDetail();
		}
		if (onPreview instanceof Function) {
			onPreview();
		}
		if (onShopping instanceof Function) {
			onShopping();
		}
	}

	return (<>
		<Row gutter={{ sm: 8, md: 24, lg: 48 }} className='list-card-item'>
			<Col xs={24} sm={8} lg={7} className='image'>
				<Image.PreviewGroup
					items={imagesPreview}
				>
					<Image
						alt={name}
						src={src}
						fallback={IMAGE_FALLBACK}
					/>
				</Image.PreviewGroup>
			</Col>

			<Col xs={24} sm={16} lg={17}>
				<div className='item-infor'>
					{/* describle */}
					<div className='information'>
						<Button className='title' type='link' onClick={onClickBtn}>{name}</Button>
						{author && <p className='author'>
							<UserOutlined />&nbsp;{t('intro_author')}&nbsp;{author}</p>}
						<p>{description}</p>
					</div>

					{/* selling */}
					{price && <>
						<Divider />
						<Flex align='center' justify='space-between' className='shopping'>
							<FormattedCurrency price={price} currency_code={currency_code} />
							<div className='action'>
								<Link target='_blank' href={link || SOCIAL_LINKS.FACEBOOK}>
									<Button type='primary'>{t('btn_buy')}</Button>
								</Link>
							</div>
						</Flex>
					</>}
				</div>
			</Col>
		</Row>
	</>
	)

}

export default ListViewItem;
