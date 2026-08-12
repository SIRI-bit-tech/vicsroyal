'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/constants';
import { useCart } from '@/context/cart-context';

export function FloatingWhatsAppButton() {
  const { isCartOpen } = useCart();
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  const cleanNumber = adminPhone.replace(/[^0-9]/g, '');

  const greetingMessage = encodeURIComponent(
    "Hello VIC ROYAL BEAUTY! I'm reaching out from your website to inquire about your hair collection."
  );

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${greetingMessage}`;

  // Hide floating WhatsApp button when cart drawer is open to prevent overlapping mobile checkout button
  if (isCartOpen) return null;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white text-[#0A0A0A] shadow-[0_10px_25px_rgba(0,0,0,0.4)] border border-gray-200 hover:shadow-[0_15px_30px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
      aria-label="Chat with VIC ROYAL BEAUTY on WhatsApp"
    >
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
        <Image
          src="/icons8-whatsapp.gif"
          alt="WhatsApp Chat"
          width={40}
          height={40}
          unoptimized
          className="object-cover w-full h-full"
        />
      </div>

      <span className="font-extrabold text-xs sm:text-sm text-[#0A0A0A] pr-1">
        Chat with Us
      </span>
    </motion.a>
  );
}
