"use client";

import { PhoneIcon } from "@heroicons/react/24/outline";
import { useContactOptions } from "@/hooks/useContactOptions";
import ContactOptionsModal from "@/components/ui/ContactOptionsModal";

export default function FloatingChatButton() {
  const {
    openModal,
    isModalOpen,
    productName,
    isPhoneDetailView,
    handleCall,
    handleEmail,
    handleWhatsApp,
    backToOptions,
    closeModal,
  } = useContactOptions();

  return (
    <>
      <button
        onClick={() => openModal()}
        aria-label="Contact us"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#E8B800] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
      >
        <PhoneIcon className="w-6 h-6" />
      </button>
      <ContactOptionsModal
        isOpen={isModalOpen}
        productName={productName}
        isPhoneDetailView={isPhoneDetailView}
        onCall={handleCall}
        onEmail={handleEmail}
        onWhatsApp={handleWhatsApp}
        onBackToOptions={backToOptions}
        onClose={closeModal}
      />
    </>
  );
}
