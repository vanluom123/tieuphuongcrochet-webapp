'use client'

import Script from 'next/script'
import { useSession } from 'next-auth/react'

export default function GoogleTag() {
    const {data: session, status} = useSession();
    const isPremium = session?.user?.role === 'PREMIUM_USER';
    const isSessionLoaded = status !== 'loading';

    return (
        <>
            <Script
                async
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}	
				gtag('js', new Date());	
				gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
			`,
                }}
            />
            {isSessionLoaded && !isPremium && (
                <Script
                    async
                    strategy="afterInteractive"
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_AD_CLIENT_ID}`}
                    crossOrigin="anonymous" />
            )}
        </>)
}
