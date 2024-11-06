import React from 'react';

interface StructuredDataProps {
  title: string;
  description: string;
  url: string;
  type?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  review?: {
    reviewRating: {
      ratingValue: number;
      bestRating: number;
    };
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

const StructuredData: React.FC<StructuredDataProps> = ({ title, description, url, type = "WebSite", offers, ...restProps }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    "name": title,
    "description": description,
    "url": url,
    "offers": offers,
    ...restProps
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;

