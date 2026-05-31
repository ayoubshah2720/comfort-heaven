"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  STORE_PHONE_NUMBER,
  STORE_PHONE_DISPLAY,
  STORE_EMAIL,
  STORE_WHATSAPP_NUMBER,
} from "@/constants";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface ContactButtonsProps {
  productName: string;
  onCallDesktop?: () => void;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ContactButtons({ productName, onCallDesktop }: ContactButtonsProps) {
  const isMobile = useIsMobile();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  function handleCall() {
    if (isMobile) {
      window.location.href = `tel:${STORE_PHONE_NUMBER}`;
    } else if (onCallDesktop) {
      onCallDesktop();
    } else {
      setShowPhoneNumber((prev) => !prev);
    }
  }

  function handleEmail() {
    const subject = `Inquiry about ${productName}`;
    const body = `Hi,\n\nI'm interested in "${productName}". Please share more details.\n\nThank you.`;
    window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleWhatsApp() {
    const text = `Hi, I'm interested in "${productName}". Can you share more details?`;
    window.open(
      `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold bg-[#E8B800] hover:bg-[#d4a700] transition-colors"
        >
          <PhoneIcon className="w-5 h-5" />
          Call Us
        </button>

        <button
          onClick={handleEmail}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold bg-[#3D6B6B] hover:bg-[#2a4f4f] transition-colors"
        >
          <EnvelopeIcon className="w-5 h-5" />
          Email Us
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold bg-[#25D366] hover:bg-[#1da851] transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5" />
          WhatsApp Us
        </button>
      </div>

      {showPhoneNumber && !isMobile && (
        <div className="mt-3 text-center p-3 bg-gray-50 rounded-lg">
          <a
            href={`tel:${STORE_PHONE_NUMBER}`}
            className="text-xl font-bold text-[#E8B800] hover:text-[#d4a700] transition-colors"
          >
            {STORE_PHONE_DISPLAY}
          </a>
          <p className="text-xs text-gray-400 mt-1">
            Available Mon–Sat, 9 AM – 9 PM
          </p>
        </div>
      )}
    </div>
  );
}
