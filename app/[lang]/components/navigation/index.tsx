"use client"

import React, { useEffect, useState } from 'react';
import { Button, Menu, Layout, Drawer, Image } from 'antd';
// import { FormattedMessage } from 'react-intl';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';

import { MENU_NAV, ROUTE_PATH } from '@/app/[lang]/lib/constant';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../../lib/useTranslation';

type MenuType = 'vertical' | 'horizontal' | 'inline';

const Navigation = () => {
	const [currentNav, setCurrentNav] = useState(ROUTE_PATH.HOME);
	const pathname = usePathname();
	const { t } = useTranslation();

	useEffect(() => {
		console.log('location', pathname);

		const nav = pathname.split('/')[1];
		setCurrentNav(`/${nav}`);
	}, [pathname]);

	// const [isOpenLang, setIsOpenLang] = useState(false);
	const [isOpenSidebar, setIsOpenSidebar] = useState(false);

	const { Header } = Layout;
	// const context = useContext(Context);

	// const onClickNav = (e: any) => {
	// 	setCurrentNav(e.key);
	// 	isOpenSidebar && setIsOpenSidebar(false);
	// };

	const onHome = () => {
		setCurrentNav(ROUTE_PATH.HOME);
	}

	// const onSelectLanguage: MenuProps['onClick'] = (e) => {
	// 	context.setLocale(e.key);
	// };

	// const getLabel = (key: string) => {
	// 	const item = find(LANGUAGES_LIST, l => key === l?.key);
	// 	return item?.label || context.locale;
	// }

	// const onOpenChange = (open: boolean) => {
	// 	setIsOpenLang(open);
	// };

	const getMenu = (mode: MenuType) => (
		<div className='header-sidebar'>
			<Menu
				mode={mode}
				// onClick={onClickNav}
				selectedKeys={[currentNav]}
				items={MENU_NAV.map((item) => {
					return {
						key: item.path,
						label: (
							<Link href={item.path} rel="noreferrer">
								{t(item.name as never)}
								{/* <FormattedMessage id={item.name} defaultMessage={item.name} /> */}
							</Link>
						),
					};
				})} />
		</div>
	);

	return (
		<>
			<Header className='header-wrap'>
				<div className='header-user'>
					<div className='sidebar-menu-icon'>
						<MenuOutlined onClick={() => setIsOpenSidebar(true)} style={{ fontSize: 20 }} />
					</div>
					<div className='header-logo'>
						{/* <Link href={ROUTE_PATH.HOME} onClick={onHome}>
							<img src={logo} alt='Tiệm len Tiểu Phương' />
						</Link> */}
					</div>
					<div className='header-right'>
						{/* <Tooltip title="search">
        <Button className='btn-search'
            onClick={onClickSearch}
            icon={<SearchOutlined />} />
    </Tooltip> */}
						<span className='bulkhead'>&nbsp;</span>
						{/* <Dropdown
							trigger={['click']}
							menu={{
								items: LANGUAGES_LIST,
								onClick: onSelectLanguage
							}}
							onOpenChange={onOpenChange}
						>
							<Button type='text' className='btn-lang'>
								<Space>
									{getLabel(context.locale)}
									<CaretDownOutlined className={isOpenLang ? 'transition-transform rote-180' : 'transition-transform'} />
								</Space>
							</Button>
						</Dropdown> */}
						<Button shape='circle' icon={<UserOutlined />} />
					</div>
				</div>

				{/* sidebar */}
				{getMenu('horizontal')}

			</Header>
			<Drawer
				width={340}
				className='drawer-menu'
				placement='left'
				open={isOpenSidebar}
				onClose={() => setIsOpenSidebar(false)}
				extra={
					<Link
						// onClick={() => { isOpenSidebar && setIsOpenSidebar(false) }}
						href={`${ROUTE_PATH.HOME}`} className='drawer-menu-header__logo'
					>
						{/* <Image preview={false} width={50} src={logo} alt='Tiểu Phương crochet' /> */}
						<span className='logo-text'>Tiểu Phương crochet</span>
					</Link>
				}
			>
				{getMenu('inline')}
			</Drawer>
		</>
	)
}

export default Navigation;
