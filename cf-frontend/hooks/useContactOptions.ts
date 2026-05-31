"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  STORE_PHONE_NUMBER,
  STORE_EMAIL,
  STORE_WHATSAPP_NUMBER,
} from "@/constants";

interface ContactOptionsState {
  isModalOpen: boolean;
  productName: string | null;
  isPhoneDetailView: boolean;
}

export function useContactOptions() {
  const isMobile = useIsMobile();
  const [state, setState] = useState<ContactOptionsState>({
    isModalOpen: false,
    productName: null,
    isPhoneDetailView: false,
  });

  function handleBuyNow(productName: string) {
    setState({ isModalOpen: true, productName, isPhoneDetailView: false });
  }

  function openModal(productName?: string) {
    setState({ isModalOpen: true, productName: productName ?? null, isPhoneDetailView: false });
  }

  function openPhoneModal(productName?: string) {
    setState({ isModalOpen: true, productName: productName ?? null, isPhoneDetailView: true });
  }

  function handleCall() {
    if (isMobile) {
      window.location.href = `tel:${STORE_PHONE_NUMBER}`;
    } else {
      setState((prev) => ({ ...prev, isPhoneDetailView: true }));
    }
  }

  function handleEmail() {
    const name = state.productName;
    const subject = name ? `Inquiry about ${name}` : "Furniture Inquiry";
    const body = name
      ? `Hi,\n\nI'm interested in "${name}". Please share more details.\n\nThank you.`
      : `Hi,\n\nI'm interested in your furniture. Please share more details.\n\nThank you.`;
    window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleWhatsApp() {
    const name = state.productName;
    const text = name
      ? `Hi, I'm interested in "${name}". Can you share more details?`
      : `Hi, I'm interested in your furniture. Can you share more details?`;
    window.open(
      `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  function backToOptions() {
    setState((prev) => ({ ...prev, isPhoneDetailView: false }));
  }

  function closeModal() {
    setState({ isModalOpen: false, productName: null, isPhoneDetailView: false });
  }

  return {
    handleBuyNow,
    openModal,
    openPhoneModal,
    handleCall,
    handleEmail,
    handleWhatsApp,
    backToOptions,
    closeModal,
    isModalOpen: state.isModalOpen,
    productName: state.productName,
    isPhoneDetailView: state.isPhoneDetailView,
  };
}
