'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { USER_ROLES } from '@/app/lib/constant'

const ADSENSE_SCRIPT_SELECTOR =
    'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
const ADSENSE_AD_SELECTOR = 'ins.adsbygoogle'

function removeAdsense() {
    document.querySelectorAll(ADSENSE_SCRIPT_SELECTOR).forEach((node) => node.remove())
    document.querySelectorAll(ADSENSE_AD_SELECTOR).forEach((node) => node.remove())
}

function removeAdsenseNodes(nodes: NodeList) {
    if (nodes.length === 0) {
        return;
    }
    nodes.forEach((node) => {
        if (!(node instanceof Element)) {
            return;
        }
        if (node.matches(ADSENSE_AD_SELECTOR)) {
            node.remove();
        } else {
            node.querySelectorAll(ADSENSE_AD_SELECTOR).forEach((slot) => slot.remove());
        }
    });
}

export default function GoogleTag() {
    const { data: session, status } = useSession();
    const isPremium = session?.user?.role === USER_ROLES.PREMIUM_USER;
    const isSessionLoaded = status !== 'loading';

    useEffect(() => {
        if (!isSessionLoaded || !isPremium) {
            return;
        }

        // Removing the <script> tag does not cancel an in-flight AdSense load,
        // so the observer below is what actually keeps a Premium session ad-free.
        removeAdsense();
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => removeAdsenseNodes(mutation.addedNodes));
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [isSessionLoaded, isPremium]);

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
