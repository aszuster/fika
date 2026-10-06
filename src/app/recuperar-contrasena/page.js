"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer-contrasena`,
    });

    // Siempre mostramos el mismo mensaje, exista o no esa cuenta, para no
    // revelar qué emails están registrados.
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-primary-03 h-[calc(100%-4.5rem)] flex items-center justify-center">
        <div className="w-full max-w-90 flex flex-col gap-6 px-7.25 text-center">
          <p className="hl-md uppercase">Revisá tu email</p>
          <p className="by-sm">
            Si el email ingresado tiene una cuenta, te enviamos instrucciones
            para elegir una nueva contraseña.
          </p>
          <Button
            copy="Volver a iniciar sesión"
            url="/ingresar"
            variant="primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-4.5rem)]  relative">
      <div className="w-full h-full relative">
        <div className="grid grid-cols-2 bg-primary-01 gap-px w-full h-full">
          <div className="bg-primary-03"></div>
          <div className="bg-primary-03"></div>
          <div className="bg-primary-03"></div>
          <div className="relative bg-primary-03">
            <Image
              src="/img/cross.svg"
              width={24}
              height={24}
              alt=""
              className="pointer-events-none absolute top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
      <div className="bg-primary-03 h-full  w-full border-x border-primary-01 relative">
        <form onSubmit={handleSubmit} className="w-full flex flex-col h-full ">
          <div className="h-full w-full flex flex-col justify-between">
            <div className="w-full h-full flex justify-center items-center">
              <div className="w-full flex flex-col items-center">
                <p className="hl-md uppercase text-center max-w-98.75">
                  Recuperar contraseña
                </p>
                <p className="by-sm text-secondary-02 text-center max-w-87.5">
                  Ingresá tu email y te mandamos un link para elegir una nueva
                  contraseña.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full pb-2">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full py-3.75 px-5 by-sm border-y border-primary-00 bg-transparent outline-none"
              />
            </div>
          </div>
          <div className="h-full w-full flex flex-col justify-between">
            <Button
            className="border-x-0!"
              copy={loading ? "Enviando..." : "Enviar instrucciones"}
              type="submit"
              variant="primary"
              disabled={loading || !email.trim()}
            />

            <p className="by-sm text-center pb-20.75">
              <Link
                href="/ingresar"
                className="underline btn-sm hover:text-secondary-01 transition-all"
              >
                Volver a iniciar sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className="w-full h-full relative">
        <div className="grid grid-cols-2 bg-primary-01 gap-px w-full h-full">
          <div className="bg-primary-03"></div>
          <div className="bg-primary-03"></div>
          <div className="bg-primary-03"></div>
          <div className="relative bg-primary-03">
            <Image
              src="/img/cross.svg"
              width={24}
              height={24}
              alt=""
              className="pointer-events-none absolute top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
