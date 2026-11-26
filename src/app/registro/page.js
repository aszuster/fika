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
import FieldError from "@/components/forms/FieldError";
import { useValidation } from "@/utils/useValidation";

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

const STEP_1_FIELDS = [
  "fullName",
  "email",
  "password",
  "repeatPassword",
  "professionalActivity",
];

const RULES = {
  fullName: { required: true },
  email: { required: true, type: "email" },
  password: { required: true, type: "password" },
  repeatPassword: {
    required: true,
    validate: (value, values) =>
      value !== values.password ? "Las contraseñas no coinciden" : null,
  },
  professionalActivity: { required: true },
  phone: { required: true, type: "phone" },
  country: { required: true },
  stateProvince: { required: true },
  city: { required: true },
};

const TextField = ({ label, error, required, ...props }) => (
  <div className="flex flex-col not-last:border-b not-last:border-primary-01">
    <input
      {...props}
      aria-invalid={Boolean(error)}
      placeholder={required ? `*${label}` : label}
      className="by-sm  bg-transparent outline-none py-2 2xl:py-3.75 px-5"
    />
    <FieldError message={error} />
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

  const { errors, touch, validate, isValid, isValidFor } = useValidation(
    form,
    RULES,
  );

  // Props comunes de cada campo de texto: valor, error y validación al salir.
  const fieldProps = (name) => ({
    id: name,
    value: form[name],
    error: errors[name],
    onChange: (event) =>
      setForm((prev) => ({ ...prev, [name]: event.target.value })),
    onBlur: () => touch(name),
  });

  const goToStep2 = () => {
    if (validate(STEP_1_FIELDS)) setStep(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Enter en el paso 1 pasa al siguiente en vez de enviar.
    if (step === 1) {
      goToStep2();
      return;
    }
    if (loading || !validate()) return;

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
      <div className="flex h-[calc(100dvh-3.125rem)] relative">
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
            <div className="h-full flex flex-col justify-center p-20">
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
    <div className="flex h-[calc(100dvh-3.125rem)] relative">
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
        <form noValidate onSubmit={handleSubmit} className="w-full flex flex-col">
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
                  {...fieldProps("fullName")}
                  label="Nombre y Apellido"
                  type="text"
                  required
                  autoComplete="name"
                />

                <TextField
                  {...fieldProps("email")}
                  label="Mail de contacto (Usuario)"
                  type="email"
                  required
                  autoComplete="email"
                />

                <div className="flex flex-col border-b border-primary-01">
                  <div className="flex items-center gap-2">
                    <input
                      {...fieldProps("password")}
                      error={undefined}
                      aria-invalid={Boolean(errors.password)}
                      placeholder="*Contraseña"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="by-sm bg-transparent outline-none flex-1 py-2 2xl:py-3.75 pl-5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="by-sm text-secondary-02 cursor-pointer pr-5"
                    >
                      {showPassword ? <Visible /> : <Hidden />}
                    </button>
                  </div>
                  <FieldError message={errors.password} />
                </div>

                <div className="flex flex-col border-b border-primary-01">
                  <div className="flex items-center gap-2">
                    <input
                      {...fieldProps("repeatPassword")}
                      error={undefined}
                      aria-invalid={Boolean(errors.repeatPassword)}
                      placeholder="*Repetir contraseña"
                      type={showRepeatPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="by-sm bg-transparent outline-none flex-1 py-2 2xl:py-3.75 pl-5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword((value) => !value)}
                      className="by-sm text-secondary-02 cursor-pointer pr-5"
                    >
                      {showRepeatPassword ? <Visible /> : <Hidden />}
                    </button>
                  </div>
                  <FieldError message={errors.repeatPassword} />
                </div>

                <div className="flex flex-col border-b border-primary-01">
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
                    className="by-sm bg-transparent py-2 2xl:py-3.75 pl-5 pr-7"
                  />
                  <FieldError message={errors.professionalActivity} />
                </div>

                <TextField
                  {...fieldProps("company")}
                  label="Empresa"
                  type="text"
                />

                <TextField
                  {...fieldProps("websiteOrInstagram")}
                  label="Web / Instagram"
                  type="text"
                />
              </div>
              <Button
                copy="Siguiente"
                type="button"
                variant="primary"
                disabled={!isValidFor(STEP_1_FIELDS)}
                onClick={goToStep2}
                className="border-x-0! border-y! border-primary-00!"
              />
            </>
          ) : (
            <>
              <TextField
                {...fieldProps("phone")}
                label="Teléfono"
                type="tel"
                required
                autoComplete="tel"
              />
              <TextField
                {...fieldProps("country")}
                label="País"
                type="text"
                required
                autoComplete="country-name"
              />
              <TextField
                {...fieldProps("stateProvince")}
                label="Provincia"
                type="text"
                required
              />
              <TextField
                {...fieldProps("city")}
                label="Localidad"
                type="text"
                required
              />

              <FieldError message={error} className="pt-2" />

              <div className="flex">
                <Button
                  copy="Volver"
                  type="button"
                  variant="primary"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className={`border-x-0! border-y! border-l! border-primary-00! bg-primary-03! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!`}
                />
                <Button
                  copy={loading ? "Creando cuenta..." : "Crear cuenta"}
                  type="submit"
                  variant="primary"
                  disabled={loading || !isValid}
                  className={`border-x-0! border-y! border-primary-00! bg-primary-03! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!`}
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
