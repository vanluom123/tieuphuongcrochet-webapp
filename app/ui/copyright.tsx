import { YoutubeOutlined, FacebookOutlined } from '@ant-design/icons'
import { Divider, Space } from 'antd';
import Link from 'next/link';
import { SOCIAL_LINKS } from '@/app/lib/constant';

const CopyRight = () => {
	return (
		<div className='copyright-wrap'>
			<p className='copyright xt-3xl font-bold underline'>Tiểu Phương © 2023 Created by Lượm & Phương</p>
			<div className='align-center' style={{ width: '100%' }}>
				<Space className='social-link'>
					<Link
						target='_blank'
						href={SOCIAL_LINKS.FACEBOOK}>
						<FacebookOutlined
							style={{ fontSize: 22 }} />
					</Link>
					<Divider type='vertical' />
					<Link target='_blank'
						href={SOCIAL_LINKS.YOUTUBE}>
						<YoutubeOutlined
							style={{ fontSize: 24 }} />
					</Link>
				</Space>
			</div>
		</div>
	)
}

export default CopyRight;
