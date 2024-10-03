'use client'

import React from 'react';
import {  Card, Image, Skeleton, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import { EditOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link'

import { IMAGE_FALLBACK, ROUTE_PATH } from '@/app/lib/constant';
import { Product } from '@/app/lib/definitions';
import FormattedCurrency from '../forrmat-currency';

import '../../ui/components/productCard.scss';

interface ProductCardProps {
	width?: string | number;
	product: Product;
	onPreview?: () => void;
	onShopping?: () => void;
	onReadDetail?: () => void;
	parentLink?: string;
	loading?: boolean;
};

const ProductCard = (
	{
		width,
		product,
		onPreview,
		onReadDetail,
		onShopping,
		parentLink = `${ROUTE_PATH.SHOP}/${ROUTE_PATH.DETAIL}`,
		loading
	}: ProductCardProps) => {
	const t = useTranslations("Btn");
	const { Meta } = Card;
	const { currency_code, price, name, src, link, id, imagesPreview } = product;

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
		<Card
			className={name ? 'card-product card-item' : 'card-product not-title card-item'}
			hoverable
			bordered={false}
			style={{ width: width || '100%' }}
			styles={{
				body: {
					overflow: 'hidden',
				},
			}}
			cover={
				<>
				{src && loading ?
					<Skeleton.Image active /> :
					<Image.PreviewGroup
						items={imagesPreview}
					>
						<Image
							alt={name}
							src={src}
							fallback={IMAGE_FALLBACK}
						/>
					</Image.PreviewGroup>
				}
			</>
			}
			actions={[
				<Tooltip key="buy-tooltip" color='#fc8282' title="Buy">
					<a key='shopping' target='_blank' href={link || '#'} rel="noopener noreferrer">
						<ShoppingCartOutlined style={{ fontSize: 18 }} />
					</a>
				</Tooltip>,
				<Tooltip key="view-detail-tooltip" color='#fc8282' title={t('btn_view_detail')}>
					<Link key="edit" href={`${parentLink}/${id}`}>
						<EditOutlined style={{ fontSize: 18 }} />
					</Link>
				</Tooltip>
			]}
		>
			{name &&
				<Meta
					title={<span tabIndex={1} className='card-title' onClick={onClickBtn}>{name}</span>}
					description={<FormattedCurrency price={price} currency_code={currency_code || 'VND'} />}
				/>
			}
		</Card>
	</>
	)

}

export default ProductCard;
