import Script from 'next/script'

export default function GoogleTag() {
    return (
        <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <Script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                    __html: `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}	
				gtag('js', new Date());	
				gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
			`,
                }}
            />
            <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_AD_CLIENT_ID}`}
                crossOrigin="anonymous" />
        </>)
}
