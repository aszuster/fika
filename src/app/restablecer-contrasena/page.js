"use client";

import { useEffect, useState } from "react";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import { translateAuthError } from "@/utils/supabase/authErrors";
import Visible from "@/svg/Visible";
import Hidden from "@/svg/Hidden";
import FieldError from "@/components/forms/FieldError";
import { useValidation } from "@/utils/useValidation";

const RULES = {
  password: { required: true, type: "password" },
  repeatPassword: {
    required: true,
    validate: (value, values) =>
      value !== values.password ? "Las contraseñas no coinciden" : null,
  },
};

// Mismo estilo que el resto, sin el padding lateral (acá los campos no tienen).
const errorClass = "px-0! pb-0! pt-1";

export default function RestablecerContrasenaPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // El link del email deja al usuario con una sesión temporal de
  // "recuperación" — Supabase avisa de eso con este evento en vez de con
  // una sesión normal.
  useEffect(() => {
    const supabase = createClient();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const { errors, touch, validate, isValid } = useValidation(
    { password, repeatPassword },
    RULES,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (loading || !validate()) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(translateAuthError(error.message));
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-primary-03 h-[calc(100%-3.125rem)] flex items-center justify-center">
        <div className="w-full max-w-90 flex flex-col gap-6 px-7.25 text-center">
          <p className="hl-md uppercase">Contraseña actualizada</p>
          <Button copy="Iniciar sesión" url="/ingresar" variant="primary" />
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="bg-primary-03 h-[calc(100%-3.125rem)] flex items-center justify-center">
        <div className="w-full max-w-90 flex flex-col gap-6 px-7.25 text-center">
          <p className="by-sm text-secondary-02">
            Este link no es válido o ya expiró. Pedí uno nuevo desde
            &quot;¿Olvidó la contraseña?&quot; en la pantalla de ingreso.
          </p>
          <Button
            copy="Pedir un link nuevo"
            url="/recuperar-contrasena"
            variant="secondary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-03 h-[calc(100%-3.125rem)] flex items-center justify-center">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-full max-w-90 flex flex-col gap-6 px-7.25"
      >
        <p className="hl-md uppercase text-center">
          Elegí una nueva contraseña
        </p>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="by-sm text-secondary-02">
            Nueva contraseña
          </label>
          <div className="flex items-center gap-2 border-b border-primary-00">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => touch("password")}
              aria-invalid={Boolean(errors.password)}
              className="by-sm bg-transparent py-2 outline-none flex-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="by-sm text-secondary-02 cursor-pointer"
            >
              {showPassword ? <Visible/> : <Hidden/>}
            </button>
          </div>
          <FieldError message={errors.password} className={errorClass} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="repeatPassword" className="by-sm text-secondary-02">
            Repetir contraseña
          </label>
          <input
            id="repeatPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={repeatPassword}
            onChange={(event) => setRepeatPassword(event.target.value)}
            onBlur={() => touch("repeatPassword")}
            aria-invalid={Boolean(errors.repeatPassword)}
            className="by-sm border-b border-primary-00 bg-transparent py-2 outline-none"
          />
          <FieldError message={errors.repeatPassword} className={errorClass} />
        </div>

        <FieldError message={error} className={errorClass} />

        <Button
          copy={loading ? "Guardando..." : "Guardar contraseña"}
          type="submit"
          variant="primary"
          disabled={loading || !isValid}
        />
      </form>
    </div>
  );
}
