'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { checkVipStatus } from '@/app/lib/service/vipService';
import Script from 'next/script';

interface AdvertisementProps {
    adSlot?: string;
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    className?: string;
}

export default function Advertisement({ adSlot, format = 'auto', className = '' }: AdvertisementProps) {
    const { data: session } = useSession();
    const [isVip, setIsVip] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkVip = async () => {
            if (session?.user) {
                try {
                    const vipStatus = await checkVipStatus();
                    setIsVip(vipStatus);
                } catch (error) {
                    console.error('Error checking VIP status:', error);
                }
            }
            setIsLoading(false);
        };

        checkVip();
    }, [session]);

    // Không hiển thị gì khi đang kiểm tra trạng thái VIP
    if (isLoading) {
        return null;
    }

    // Nếu người dùng là VIP, không hiển thị quảng cáo
    if (isVip) {
        return null;
    }

    // Định dạng quảng cáo dựa trên tham số format
    let adStyle = {};
    switch (format) {
        case 'rectangle':
            adStyle = { display: 'inline-block', width: '300px', height: '250px' };
            break;
        case 'horizontal':
            adStyle = { display: 'inline-block', width: '728px', height: '90px' };
            break;
        case 'vertical':
            adStyle = { display: 'inline-block', width: '160px', height: '600px' };
            break;
        default:
            adStyle = { display: 'block', width: '100%', height: 'auto' };
    }

    return (
        <div className={`advertisement-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={adStyle}
                data-ad-client={process.env.NEXT_PUBLIC_AD_CLIENT_ID}
                data-ad-slot={adSlot || ''}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
            <Script id="adsense-init">
                {`
                    (adsbygoogle = window.adsbygoogle || []).push({});
                `}
            </Script>
        </div>
    );
} 