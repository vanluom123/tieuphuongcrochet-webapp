import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Col, Flex, Row } from 'antd';
import CopyRight from '../copy-right';
import { FOOTER_LINK, ROUTE_PATH } from '@/app/lib/constant';
import logo from '@/public/logo.png';
import Image from 'next/image';

interface FooterProps {
    currentNav: string
}

const FooterPage: React.FC<FooterProps> = ({ currentNav }) => {
    const t = useTranslations("MenuNav");

    const getActiveClass = useMemo(() => (path: string) => {
        if (currentNav === ROUTE_PATH.HOME) {
            return path === currentNav ? 'actived' : '';
        }
        return path.includes(currentNav) ? 'actived' : '';
    }, [currentNav]);

    return (
        <footer className='footer-wrap'>
            <Flex vertical align='center'>
                <Image className='footer-logo' src={logo} alt="Logo" width={300} height={360} />
                <Row className='footer-link-wrap' gutter={[48, 12]}>
                    {FOOTER_LINK.map(({ name, path }, index) =>
                        <Col className={getActiveClass(path)} key={`${name}_${index}`} md={8} xs={12}>
                            <Link className='footer-link' href={path}>{t(name)}</Link>
                        </Col>
                    )}
                </Row>
                <CopyRight />
            </Flex>
        </footer>
    );
};

export default React.memo(FooterPage);
