import React from 'react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2B0A1F] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E6007E]/50 flex-shrink-0">
              <Image src="/logo.png" alt="VIC ROYAL BEAUTY Logo" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white">
              VIC ROYAL <span className="text-[#E6007E]">BEAUTY</span>
            </h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-md">
            Your premier destination for 100% Virgin Hair wigs, raw human hair bundles, HD closures, frontals, and luxury accessories.
          </p>
        </div>

        <div>
          <h4 className="text-base font-semibold text-white mb-3">Order & Support</h4>
          <p className="text-sm text-gray-400 mb-2 max-w-md">
            Orders are reviewed on-site and seamlessly completed via direct WhatsApp consultation for personalized delivery & customer service.
          </p>
          <div className="inline-block mt-2 px-3 py-1 bg-[#2B0A1F] rounded-full text-xs font-semibold text-[#FF4FA0]">
            Direct WhatsApp Sales & Concierge
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#2B0A1F]/50 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} VIC ROYAL BEAUTY. All rights reserved.
      </div>
    </footer>
  );
}
