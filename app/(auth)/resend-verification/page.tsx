import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next/types';
import AuthRouteRedirect from '@/app/components/auth/AuthRouteRedirect';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ResendVerification');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${process.env.NEXT_PUBLIC_URL}/resend-verification`,
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Resend Verification Tieu Phuong Crochet',
        },
      ],
    },
  };
}

const ResendVerificationPage = () => (
  <Suspense fallback={null}>
    <AuthRouteRedirect auth="resend_verification" />
  </Suspense>
);

export default ResendVerificationPage;
