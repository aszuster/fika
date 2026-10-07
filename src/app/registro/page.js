"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import { translateAuthError } from "@/utils/supabase/authErrors";
import { PROFESSIONAL_ACTIVITIES } from "@/data/profile";
import Image from "next/image";
import Visible from "@/svg/Visible";
import Hidden from "@/svg/Hidden";
import Select from "@/components/forms/Select";

const initialForm = {
  email: "",
  fullName: "",
  password: "",
  repeatPassword: "",
  professionalActivity: "",
  company: "",
  websiteOrInstagram: "",
  phone: "",
  country: "",
  stateProvince: "",
  city: "",
};

const TextField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1 not-last:border-b not-last:border-primary-01">
    <input
      {...props}
      placeholder={`*${label}`}
      className="by-sm  bg-transparent outline-none py-3.75 px-5"
    />
  </div>
);

export default function RegistroPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  const setField = (name) => (event) =>
    setForm((prev) => ({ ...prev, [name]: event.target.value }));

  const isStep1Valid =
    form.email.trim() !== "" &&
    form.fullName.trim() !== "" &&
    form.password.length >= 6 &&
    form.repeatPassword === form.password &&
    form.professionalActivity !== "";

  const isStep2Valid =
    form.phone.trim() !== "" &&
    form.country.trim() !== "" &&
    form.stateProvince.trim() !== "" &&
    form.city.trim() !== "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isStep2Valid) return;

    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          professional_activity: form.professionalActivity,
          company: form.company || null,
          website_or_instagram: form.websiteOrInstagram || null,
          phone: form.phone,
          country: form.country,
          state_province: form.stateProvince,
          city: form.city,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(translateAuthError(error.message));
      return;
    }

    setNeedsEmailConfirmation(!data.session);
    setStep("done");
  };

  if (step === "done") {
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
        <div className="bg-primary-03 border-x border-primary-01 w-full h-full flex items-center justify-center">
          <div className="w-full h-full flex flex-col justify-between items-center text-center">
            <div className="h-full flex flex-col justify-center pt-20">
              <p className="hl-sm uppercase pb-6">Gracias por registrarte</p>
              {needsEmailConfirmation ? (
                <p className="by-sm">
                  Te enviamos un email para confirmar tu cuenta. Una vez
                  confirmada, ya podés iniciar sesión.
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-w-92.25">
                  <p className="by-sm text-secondary-01">
                    Estamos revisando tus datos para activar tu cuenta
                    profesional. Te contactaremos por correo electrónico una vez
                    que el proceso haya finalizado.
                  </p>
                  <p className="by-sm text-secondary-01">
                    Mientras tanto, podés continuar explorando el catálogo
                    completo.
                  </p>
                </div>
              )}
            </div>
            <Button
              copy="Ver productos"
              url="/"
              variant="tertiary"
              className="mb-20"
            />
          </div>
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
      <div className="bg-primary-03 border-x border-primary-01 w-full h-full flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <div className="flex flex-col items-center">
            <p className="hl-lg uppercase text-center max-w-105">
              Creá tu cuenta
            </p>
            <div className="by-sm font-normal! text-secondary-02 text-center max-w-82.75 flex flex-col gap-2 py-6.25">
              <p>
                Guardá tus favoritos, accedé a precios y pedí presupuestos desde
                el sitio.{" "}
              </p>
              <p>
                Completá tus datos — revisamos cada solicitud antes de habilitar
                el acceso.
              </p>
            </div>
          </div>
          <p className="by-sm text-primary-00 text-center font-normal! pb-3">
            Paso {step}/2
          </p>

          {step === 1 ? (
            <>
              <div className="border-t border-primary-00">
                <TextField
                  id="fullName"
                  label="Nombre y Apellido"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={setField("fullName")}
                />

                <TextField
                  id="email"
                  label="Mail de contacto (Usuario)"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={setField("email")}
                />

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 border-b border-primary-01">
                    <input
                      id="password"
                      placeholder="*Contraseña"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={setField("password")}
                      className="by-sm bg-transparent outline-none flex-1 py-3.75 pl-5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="by-sm text-secondary-02 cursor-pointer pr-5"
                    >
                      {showPassword ? <Hidden /> : <Visible />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 border-b border-primary-01">
                    <input
                      id="repeatPassword"
                      placeholder="*Repetir contraseña"
                      type={showRepeatPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={form.repeatPassword}
                      onChange={setField("repeatPassword")}
                      className="by-sm bg-transparent outline-none flex-1 py-3.75 pl-5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword((value) => !value)}
                      className="by-sm text-secondary-02 cursor-pointer pr-5"
                    >
                      {showRepeatPassword ? <Hidden /> : <Visible />}
                    </button>
                  </div>
                  {form.repeatPassword !== "" &&
                    form.repeatPassword !== form.password && (
                      <p className="by-sm text-[#A20000]">
                        Las contraseñas no coinciden.
                      </p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                  <Select
                    value={form.professionalActivity}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        professionalActivity: value,
                      }))
                    }
                    options={PROFESSIONAL_ACTIVITIES}
                    placeholder="*Actividad profesional"
                    className="by-sm border-b border-primary-01 bg-transparent py-3.75 pl-5 pr-7"
                  />
                </div>

                <TextField
                  id="company"
                  label="Empresa"
                  type="text"
                  value={form.company}
                  onChange={setField("company")}
                />

                <TextField
                  id="websiteOrInstagram"
                  label="Web / Instagram"
                  type="text"
                  value={form.websiteOrInstagram}
                  onChange={setField("websiteOrInstagram")}
                />
              </div>
              <Button
                copy="Siguiente"
                type="button"
                variant="primary"
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
                className="border-x-0! border-y! border-primary-00!"
              />
            </>
          ) : (
            <>
              <TextField
                id="phone"
                label="Teléfono"
                type="tel"
                required
                value={form.phone}
                onChange={setField("phone")}
              />
              <TextField
                id="country"
                label="País"
                type="text"
                required
                value={form.country}
                onChange={setField("country")}
              />
              <TextField
                id="stateProvince"
                label="Provincia"
                type="text"
                required
                value={form.stateProvince}
                onChange={setField("stateProvince")}
              />
              <TextField
                id="city"
                label="Localidad"
                type="text"
                required
                value={form.city}
                onChange={setField("city")}
              />

              {error && <p className="by-sm text-[#A20000]">{error}</p>}

              <div className="flex">
                <Button
                  copy={loading ? "Creando cuenta..." : "Crear cuenta"}
                  type="submit"
                  variant="primary"
                  disabled={!isStep2Valid || loading}
                  className={`border-x-0! border-y! border-primary-00! bg-primary-03! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!`}
                />
                <Button
                  copy="Volver"
                  type="button"
                  variant="primary"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className={`border-x-0! border-y! border-l! border-primary-00! bg-primary-03! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!`}
                />
              </div>
            </>
          )}

          <div className="flex flex-col justify-center items-center gap-2 pt-7">
            <p className="by-sm text-center ">¿Ya tenés cuenta?</p>
            <Link
              href="/ingresar"
              className="underline btn-sm hover:text-secondary-01 transition-all"
            >
              Iniciar sesión
            </Link>
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
