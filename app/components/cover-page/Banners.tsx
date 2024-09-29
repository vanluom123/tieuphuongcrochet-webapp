import React from 'react';
import { Carousel } from 'antd';
import { map } from 'lodash';

import BannerItem from './BannerItem';
import { getBannersByType } from '@/app/lib/utils';
import { Banner } from '@/app/lib/definitions';

interface BannersListProps {    
    banners: Banner[];
}

const BannersList = ({ banners }: BannersListProps) => {

	return (
		<div className='banner-wrap'>
			<Carousel autoplay fade waitForAnimate dots={{className: 'dots-custom'}}>
				{
					map(getBannersByType(banners, 'Home'), (b, index) => (
						<BannerItem key={`banner_${index}`} banner={b} />
					))
				}
			</Carousel>
		</div>
	)
}

export default BannersList;
