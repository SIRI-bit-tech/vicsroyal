import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { FloatingWhatsAppButton } from '@/components/ui/floating-whatsapp-button';

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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingWhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
