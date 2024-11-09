"use client"

import React, { useEffect, useState } from 'react';
import {Layout } from 'antd';
import Image from 'next/image';
import { MenuOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import logo from '@/public/logo.png';
import { ROUTE_PATH } from '@/app/lib/constant';

import Languages from './Languages';
import SidebarNav from './Sidebar';
import MenuNav from './MenuNav';
import '../../ui/navigation.scss';

interface NavigationProps {
    currentNav: string;
    setCurrentNav: (nav: string) => void;
}

const Navigation = ({ currentNav, setCurrentNav }: NavigationProps) => {
	const [isOpenSidebar, setIsOpenSidebar] = useState(false);

	const { Header } = Layout;
	const pathname = usePathname();

	useEffect(() => {
		const nav = pathname.split('/')[1] || '';
		setCurrentNav(`/${nav}`);
	}, [pathname, setCurrentNav]);


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


	return (
		<>
			<Header className='header-wrap'>
				<div className='header-user'>
					<div className='sidebar-menu-icon'>
						<MenuOutlined onClick={() => setIsOpenSidebar(true)} style={{ fontSize: 20 }} />
					</div>
					<div className='header-logo'>
						<Link href={ROUTE_PATH.HOME} onClick={onHome}>
							<Image priority width={120} height={120} src={logo.src} alt='Tiệm len Tiểu Phương' />
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
						{/* <UserAccount />	 */}
					</div>
				</div>

				{/* menu navigation for desktop */}
				<MenuNav
					mode='horizontal'
					onClickNav={onClickNav}
					currentNav={currentNav} />

			</Header>

			{/* menu navigation for mobile */}
			<SidebarNav
				isOpenSidebar={isOpenSidebar}
				setIsOpenSidebar={setIsOpenSidebar}>
				<MenuNav
					mode='inline'
					onClickNav={onClickNav}
					currentNav={currentNav} />
			</SidebarNav>
		</>
	)
}

export default Navigation;
