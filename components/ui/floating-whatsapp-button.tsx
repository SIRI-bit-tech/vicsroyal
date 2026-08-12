'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/constants';

export function FloatingWhatsAppButton() {
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  const cleanNumber = adminPhone.replace(/[^0-9]/g, '');

  const greetingMessage = encodeURIComponent(
    "Hello VIC ROYAL BEAUTY! I'm reaching out from your website to inquire about your hair collection."
  );

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${greetingMessage}`;

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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.5)] border border-white/20 hover:shadow-[0_15px_30px_rgba(37,211,102,0.7)] transition-all cursor-pointer"
      aria-label="Chat with VIC ROYAL BEAUTY on WhatsApp"
    >
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#25D366] flex items-center justify-center">
        <Image
          src="/icons8-whatsapp.gif"
          alt="WhatsApp Chat"
          width={40}
          height={40}
          unoptimized
          className="object-cover w-full h-full mix-blend-multiply contrast-125"
        />
      </div>

      <span className="font-extrabold text-xs sm:text-sm text-white pr-1">
        Chat with Us
      </span>
    </motion.a>
  );
}
