"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import { translateAuthError } from "@/utils/supabase/authErrors";
import Image from "next/image";
import Visible from "@/svg/Visible";
import Hidden from "@/svg/Hidden";

export default function IngresarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(translateAuthError(error.message));
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex h-[calc(100dvh-4.5rem)] relative">
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
      <div className="bg-primary-03 h-full  w-full border-x border-primary-01">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center h-full"
        >
          <div className="h-full flex flex-col justify-between w-full">
            <div className="flex flex-col h-full w-full justify-center items-center gap-6.25">
              <p className="hl-md uppercase text-center max-w-100">
                Ingresá a tu cuenta
              </p>
              <p className="by-sm font-normal! text-secondary-01 text-center max-w-82.75">
                Accedé a tus favoritos, guardá productos y retomá tus
                selecciones cuando quieras.
              </p>
            </div>
            <div className="">
              <div className="w-full border-y border-primary-00">
                <div className="flex gap-1 w-full">
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full by-sm font-normal! border-b border-primary-01 bg-transparent py-3.75 px-5 outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 w-full">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full by-sm bg-transparent outline-none font-normal! py-3.75 pl-5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="by-sm text-secondary-02 cursor-pointer pr-5 whitespace-nowrap"
                  >
                    {showPassword ? <Hidden/> : <Visible/>}
                  </button>
                </div>

                {error && <p className="by-sm text-[#A20000]">{error}</p>}
              </div>
              <div className="flex justify-between w-full py-3.75 px-5">
                <div className="flex gap-2">
                  <input type="checkbox" id="remember" name="remember" />
                  <label htmlFor="remember" className="by-sm font-normal!">
                    Recordarme
                  </label>
                </div>
                <Link
                  href="/recuperar-contrasena"
                  className="by-sm font-normal! cursor-pointer underline hover:text-secondary-01 transition-all"
                >
                  ¿Olvidó la contraseña?
                </Link>
              </div>
            </div>
          </div>
          <div className="h-full w-full flex flex-col justify-between">
            <Button
            className="border-x-0!"
              copy={loading ? "Ingresando..." : "Iniciar sesión"}
              type="submit"
              variant="primary"
              disabled={loading || !email.trim() || !password}
            />
            <div className="flex flex-col justify-center items-center gap-2 pb-20.75">
              <p className="by-sm text-center ">¿Todavía no tenes cuenta?</p>
              <Link href="/registro" className="underline btn-sm hover:text-secondary-01 transition-all">
                Crear cuenta
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className="w-full">
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
