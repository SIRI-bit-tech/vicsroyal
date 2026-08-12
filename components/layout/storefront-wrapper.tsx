'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer } from '../cart/cart-drawer';
import { FloatingWhatsAppButton } from '../ui/floating-whatsapp-button';

interface StorefrontWrapperProps {
  children: React.ReactNode;
}

export function StorefrontWrapper({ children }: StorefrontWrapperProps) {
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/auth/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen flex flex-col">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsAppButton />
    </>
  );
}
