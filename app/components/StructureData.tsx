import Script from "next/script";
import { ROUTE_PATH } from "../lib/constant";

// ========== Interface Definitions ==========

interface OrganizationConfig {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    city: string;
    region: string;
    country: string;
    street: string;
  };
  phone: string;
  email: string;
  sameAs?: string[];
}

interface WebPageConfig {
  title: string;
  description: string;
  url: string;
  image?: string | string[];
}

interface ProductSchemaProps {
  name: string;
  description?: string;
  images: string[];
  price: number | string;
  inStock: boolean;
  url: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQQuestion {
  question: string;
  answer: string;
}

interface ArticleSchemaProps {
  title: string;
  description?: string;
  image?: string | string[];
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  publisher?: string;
  articleBody?: string;
}

interface ArticleShortProps {
  title: string;
  description: string;
  image?: string | string[];
  url?: string;
}

interface AboutPageSchemaProps {
  title: string;
  description: string;
}

interface ContactPageSchemaProps {
  title: string;
  description: string;
  url?: string;
  phone: string;
  email: string;
}

interface StructuredDataProps {
  data: object;
}

// ========== Schema Functions ==========

export const createOrganizationSchema = (config: OrganizationConfig) => {
  const {
    name,
    url,
    logo,
    description,
    address,
    phone,
    email,
    sameAs = [],
  } = config;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country,
      streetAddress: address.street,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
      email,
    },
    sameAs,
  };
};

export const createWebPageSchema = (config: WebPageConfig) => {
  const { title, description, url, image } = config;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    image,
  };
};

export const createProductSchema = ({
  name,
  description,
  images,
  price,
  inStock,
  url,
}: ProductSchemaProps) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    url,
    brand: {
      "@type": "Brand",
      name: "Tiểu Phương Crochet",
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "VND",
      url,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: "Tiểu Phương Crochet",
      },
    },
  };
};

export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const createFAQSchema = (questions: FAQQuestion[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
};

export const createArticleSchema = ({
  title,
  image,
  url,
  datePublished,
  dateModified,
  description = "",
  author = "Tiểu Phương Crochet",
  publisher = "Tiểu Phương Crochet",
  articleBody = "",
}: ArticleSchemaProps) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    articleBody,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: publisher,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
      },
    },
  };
};

export const createArticleSchemaShort = ({
  title,
  description,
  image,
}: ArticleShortProps) => ({
  "@type": "Article",
  headline: title,
  description,
  image,
  author: {
    "@type": "Organization",
    name: "Tiểu Phương Crochet",
  },
});

export const createAboutPageSchema = ({
  title,
  description,
}: AboutPageSchemaProps) => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: title,
  description,
  url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.ABOUT}`,
  mainEntity: {
    "@type": "Organization",
    name: "Tiểu Phương Crochet",
    url: process.env.NEXT_PUBLIC_URL,
    logo: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
  },
});

export const createContactPageSchema = ({
  title,
  description,
  phone,
  email,
}: ContactPageSchemaProps) => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: title,
  description,
  url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.CONTACT}`,
  mainEntity: {
    "@type": "Organization",
    name: "Tiểu Phương Crochet",
    url: process.env.NEXT_PUBLIC_URL,
    logo: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      email,
      contactType: "customer service",
      areaServed: "VN",
      availableLanguage: ["Vietnamese"],
    },
  },
});

export interface CreativeWorkSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string | string[];
  author?: string;
}

export const createCreativeWorkSchema = ({
  title,
  description,
  url,
  image,
  author
}: CreativeWorkSchemaProps) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: title,
  description,
  url,
  image,
  author: {
    "@type": "Organization",
    name: author || "Tiểu Phương Crochet",
  },
});

// ========== Structured Data Component ==========

const StructuredData = ({ data }: StructuredDataProps) => {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
};

export default StructuredData;
