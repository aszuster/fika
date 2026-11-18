"use client";

import { useCallback, useEffect, useState } from "react";
import AuthPromptModal from "@/components/modals/AuthPromptModal";
import { createClient } from "@/utils/supabase/client";
import { useIntroPlaying } from "@/utils/intro";

const DELAY_MS = 2000;
const DISMISSED_KEY = "fika-signup-modal-dismissed";

const wasDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
};


export default function SignupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const isIntroPlaying = useIntroPlaying();

  // La demora empieza a contar cuando termina el intro.
  useEffect(() => {
    if (isIntroPlaying || wasDismissed()) return;

    const timer = setTimeout(async () => {
      const { data } = await createClient().auth.getSession();
      if (!data.session) setIsOpen(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [isIntroPlaying]);

  const close = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
  }, []);

  return (
    <AuthPromptModal
      isOpen={isOpen}
      onClose={close}
      title="¿Sos profesional del rubro?"
      description="Creá tu cuenta para acceder a beneficios exclusivos y realizar tus pedidos."
    />
  );
}
