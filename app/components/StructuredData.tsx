import React from 'react';

interface StructuredDataProps {
  title: string;
  description: string;
  url: string;
  type?: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({ title, description, url, type = "WebSite" }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
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

