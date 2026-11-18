"use client";

import AuthPromptModal from "@/components/modals/AuthPromptModal";

// Aparece al tocar "agregar a favoritos" sin haber iniciado sesión.
export default function FavoritesLoginModal({ isOpen, onClose }) {
  return (
    <AuthPromptModal
      isOpen={isOpen}
      onClose={onClose}
      title="¿Querés agregar este producto a favoritos?"
      titleClassName="w-full max-w-100"
      textClassName="py-20"
      description="Para agregar productos a tus favoritos, necesitás tener una cuenta en FIKA."
    />
  );
}
