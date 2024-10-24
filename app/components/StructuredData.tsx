import React from 'react';

interface StructuredDataProps {
  title: string;
  description: string;
  url: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({ title, description, url }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": title,
    "description": description,
    "url": url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;

