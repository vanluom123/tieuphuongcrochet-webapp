import Script from 'next/script'

export default function GoogleTag() {
    return (
        <>
        
            <Script async strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-RTLCR6N9MQ"/>
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}	
				gtag('js', new Date());	
				gtag('config', 'G-RTLCR6N9MQ');
			`,
                }}
            />
            <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9595945500562321"
                crossOrigin="anonymous" />
        </>)
}
