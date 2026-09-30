import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next/types';
import { Spin } from 'antd';
import ResendVerification from './ResendVerification';

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

const ResendVerificationPage = () => {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Spin size="large" />
        </div>
      }
    >
      <ResendVerification />
    </Suspense>
  );
};

export default ResendVerificationPage;
