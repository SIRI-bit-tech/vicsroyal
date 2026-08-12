import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { StorefrontWrapper } from '@/components/layout/storefront-wrapper';

export const metadata: Metadata = {
  title: 'VIC ROYAL BEAUTY | Luxury Virgin Hair, Wigs & HD Lace Closures',
  description: 'Shop 100% Virgin Human Hair wigs, raw bundles, HD lace closures, frontals, and luxury hair accessories. Direct WhatsApp concierge & fast delivery.',
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
        <CartProvider>
          <StorefrontWrapper>{children}</StorefrontWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
