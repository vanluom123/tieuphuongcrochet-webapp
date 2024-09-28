"use client"

import React, { useEffect, useState } from 'react';
import { Button, Menu, Layout, Drawer } from 'antd';

import Image from 'next/image';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { MENU_NAV, ROUTE_PATH } from '@/app/[lang]/lib/constant';
import useTrans from '../../lib/useTrans';
import Languages from './Languages';

import logo from '@/public/logo.png';
import '../../ui/navigation.scss';

type MenuType = 'vertical' | 'horizontal' | 'inline';

const Navigation = () => {
	const [currentNav, setCurrentNav] = useState(ROUTE_PATH.HOME);
	const pathname = usePathname();
	const trans = useTrans();

	useEffect(() => {
		console.log('location', pathname);

		const nav = pathname.split('/')[2] || ROUTE_PATH.HOME;
		console.log('nav', nav);
		
		setCurrentNav(`/${nav}`);
	}, [pathname]);

	const [isOpenSidebar, setIsOpenSidebar] = useState(false);

	const { Header } = Layout;
	// const context = useContext(Context);

	const onClickNav = (e: { key: string }) => {		
		const key = e.key;
		if (key) {
			setCurrentNav(key);
			if (isOpenSidebar) {
				setIsOpenSidebar(false);
			}
		}
	};

	const onHome = () => {
		setCurrentNav(ROUTE_PATH.HOME);
	}


	const getMenu = (mode: MenuType) => (
		<div className='header-sidebar'>
			<Menu
				mode={mode}
				onClick={onClickNav}
				selectedKeys={[currentNav]}
				items={MENU_NAV.map((item) => {
					return {
						key: item.path,
						label: (
							<Link href={item.path} rel="noreferrer">
								{trans[item.name as keyof typeof trans]}
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
						<Link href={ROUTE_PATH.HOME} onClick={onHome}>
							<Image width={120} height={120} src={logo.src} alt='Tiệm len Tiểu Phương' />
						</Link>
					</div>
					<div className='header-right'>

						{/* Search global */}
						{/* <Tooltip title="search">
							<Button className='btn-search'
								// onClick={onClickSearch}
								icon={<SearchOutlined />} />
						</Tooltip> */}

						{/* Change language */}
						<Languages />

						{/* user icon */}
						<Button shape='circle' icon={<UserOutlined />} />
					</div>
				</div>

				{/* sidebar */}
				{getMenu('horizontal')}

			</Header>

			{/* sidebar for mobile */}
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
						<Image width={50} src={logo.src} alt='Tiểu Phương crochet' />
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
