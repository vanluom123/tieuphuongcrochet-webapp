import { YoutubeOutlined, FacebookOutlined } from '@ant-design/icons';
import { Divider, Space } from 'antd';
import Link from 'next/link';
import { SOCIAL_LINKS } from '@/app/lib/constant';

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
	<Link target='_blank' href={href}>
		{icon}
	</Link>
);

const CopyRight = () => (
	<div className='copyright-wrap'>
		<p className='copyright'>Tiểu Phương © {new Date().getFullYear()} Created by Lượm & Phương</p>
		<Space className='social-link' style={{ width: '100%', justifyContent: 'center' }}>
			<SocialLink
				href={SOCIAL_LINKS.FACEBOOK}
				icon={<FacebookOutlined
					style={{ fontSize: 22 }} />}
			/>
			<Divider type='vertical' />
			<SocialLink
				href={SOCIAL_LINKS.YOUTUBE}
				icon={<YoutubeOutlined
					style={{ fontSize: 24 }} />}
			/>
		</Space>
	</div>
);


export default CopyRight;
