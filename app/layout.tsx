import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { StorefrontWrapper } from '@/components/layout/storefront-wrapper';
import { StorefrontSchema } from '@/components/seo/json-ld';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vicroyalbeauty.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VIC ROYAL BEAUTY | Luxury Virgin Hair, Wigs & HD Lace Closures',
    template: '%s | VIC ROYAL BEAUTY',
  },
  description: 'Shop 100% Virgin Human Hair wigs, raw Cambodian bundles, HD lace closures, frontals, and luxury hair accessories. Direct WhatsApp sales concierge & worldwide express delivery.',
  keywords: [
    'virgin hair wigs',
    'bone straight wig',
    'raw human hair bundles',
    'hd lace closure',
    '5x5 closure wig',
    'frontals lagos',
    'hair extensions nigeria',
    'vic royal beauty',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: siteUrl,
    siteName: 'VIC ROYAL BEAUTY',
    title: 'VIC ROYAL BEAUTY | Luxury Virgin Hair & HD Lace Wigs',
    description: '100% Virgin & Raw Human Hair, Bone Straight Wigs, and HD Closures with worldwide express shipping.',
    images: [
      {
        url: `${siteUrl}/hero/hero-1.png`,
        width: 1200,
        height: 630,
        alt: 'VIC ROYAL BEAUTY Hair Storefront',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIC ROYAL BEAUTY | Luxury Virgin Hair & Wigs',
    description: '100% Virgin Human Hair wigs, bundles, closures & frontals with instant WhatsApp ordering.',
    images: [`${siteUrl}/hero/hero-1.png`],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#0A0A0A] text-white min-h-screen flex flex-col antialiased selection:bg-[#E6007E] selection:text-white"
      >
        <StorefrontSchema />
        <CartProvider>
          <StorefrontWrapper>{children}</StorefrontWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
