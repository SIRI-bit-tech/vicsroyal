import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { StorefrontWrapper } from '@/components/layout/storefront-wrapper';
import { StorefrontSchema } from '@/components/seo/json-ld';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vicsroyalbeauty.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VIC ROYAL BEAUTY | Luxury Virgin Hair, Wigs & HD Lace Closures',
    template: '%s | VIC ROYAL BEAUTY',
  },
  description: 'Shop 100% Virgin Human Hair wigs, raw Cambodian bundles, HD lace closures, frontals, and luxury hair accessories. Direct WhatsApp sales concierge & worldwide express delivery.',
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
