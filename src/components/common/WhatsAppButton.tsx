"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "5519988887777"; // Simulated WhatsApp Number (Hortolândia area code)
  const defaultMessage = encodeURIComponent(
    "Olá, RR Artes! Vim pelo site institucional e gostaria de mais informações sobre seus serviços de papelaria, bordados e consertos."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-110 hover:bg-emerald-600 hover:shadow-emerald-600/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-95"
      aria-label="Atendimento via WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
