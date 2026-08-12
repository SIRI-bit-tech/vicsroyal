'use client';

import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function StorefrontSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vicroyalbeauty.com';

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'VIC ROYAL BEAUTY',
    url: baseUrl,
    logo: `${baseUrl}/hero/hero-1.png`,
    description: 'Premier single-vendor storefront for 100% Virgin Human Hair wigs, raw bundles, HD closures, frontals, and luxury accessories.',
    priceRange: '₦₦₦',
    telephone: '+2348000000000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressLocality: 'Lagos',
    },
    sameAs: ['https://wa.me/2348000000000'],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are VIC ROYAL BEAUTY wigs made from 100% Virgin Hair?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all VIC ROYAL BEAUTY wigs, bundles, closures, and frontals are made from 100% Virgin and Raw Human Hair with cuticle alignment, zero shedding, and effortless bleaching to 613.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I purchase hair products on VIC ROYAL BEAUTY?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Select your preferred wigs or bundles, click Add to Cart, review your order details, and click Confirm & Send to WhatsApp for direct personal concierge verification.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does VIC ROYAL BEAUTY deliver across Nigeria and internationally?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we deliver nationwide across Nigeria via GIG and UPS, as well as worldwide international express shipping via DHL and 4PX.',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={storeSchema} />
      <JsonLd data={faqSchema} />
    </>
  );
}
