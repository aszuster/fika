"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import { translateAuthError } from "@/utils/supabase/authErrors";
import Visible from "@/svg/Visible";
import Hidden from "@/svg/Hidden";
import FieldError from "@/components/forms/FieldError";
import { useValidation } from "@/utils/useValidation";

const emptyEmailForm = {
  currentEmailInput: "",
  newEmail: "",
  confirmNewEmail: "",
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const PASSWORD_RULES = {
  currentPassword: { required: true },
  newPassword: { required: true, type: "password" },
  confirmNewPassword: {
    required: true,
    validate: (value, values) =>
      value !== values.newPassword ? "Las contraseñas no coinciden" : null,
  },
};

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  show,
  onToggleShow,
  autoComplete = "new-password",
}) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 ">
      <input
        id={id}
        placeholder={label}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className="by-sm bg-transparent outline-none flex-1 pl-5 py-3.75 "
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="by-sm text-secondary-02 cursor-pointer pr-5"
      >
        {show ? <Visible/> : <Hidden/>}
      </button>
    </div>
    <FieldError message={error} />
  </div>
);

const AccessDataForm = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  // "email" | "password" | null — como un acordeón, solo uno puede estar
  // abierto a la vez.
  const [openSection, setOpenSection] = useState(null);
  const [emailForm, setEmailForm] = useState(emptyEmailForm);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const [showMaskedPassword, setShowMaskedPassword] = useState(false);

  const [popup, setPopup] = useState(null);

  const emailContentRef = useRef(null);
  const passwordContentRef = useRef(null);
  const [emailHeight, setEmailHeight] = useState(0);
  const [passwordHeight, setPasswordHeight] = useState(0);

  useLayoutEffect(() => {
    if (emailContentRef.current) {
      setEmailHeight(emailContentRef.current.scrollHeight);
    }
    if (passwordContentRef.current) {
      setPasswordHeight(passwordContentRef.current.scrollHeight);
    }
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setCurrentEmail(data.user?.email ?? "");
    });

    // Cuando se confirma el link de cambio de email (desde la casilla
    // nueva, y la vieja si "Secure email change" está activo), Supabase
    // actualiza la sesión y dispara este evento — recién ahí el email
    // cambió de verdad.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "USER_UPDATED") {
          setCurrentEmail(session?.user?.email ?? "");
          setPopup({
            title: "Mail actualizado",
            message: "Tu email se actualizó correctamente.",
          });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const sameEmail = (a, b) =>
    a.trim().toLowerCase() === b.trim().toLowerCase();

  const emailRules = {
    currentEmailInput: {
      required: true,
      type: "email",
      validate: (value) =>
        sameEmail(value, currentEmail) ? null : "El mail actual no es correcto",
    },
    newEmail: {
      required: true,
      type: "email",
      validate: (value) =>
        sameEmail(value, currentEmail)
          ? "El mail nuevo tiene que ser distinto al actual"
          : null,
    },
    confirmNewEmail: {
      required: true,
      validate: (value, values) =>
        sameEmail(value, values.newEmail) ? null : "Los mails no coinciden",
    },
  };

  const emailValidation = useValidation(emailForm, emailRules);
  const passwordValidation = useValidation(passwordForm, PASSWORD_RULES);
  const emailErrors = emailValidation.errors;
  const passwordErrors = passwordValidation.errors;

  const setEmailField = (name) => (event) =>
    setEmailForm((prev) => ({ ...prev, [name]: event.target.value }));
  const setPasswordField = (name) => (event) =>
    setPasswordForm((prev) => ({ ...prev, [name]: event.target.value }));

  const cancelEmailChange = () => {
    setOpenSection(null);
    setEmailForm(emptyEmailForm);
    setEmailError(null);
    emailValidation.reset();
  };

  const cancelPasswordChange = () => {
    setOpenSection(null);
    setPasswordForm(emptyPasswordForm);
    setPasswordError(null);
    passwordValidation.reset();
  };

  const handleSaveEmail = async (event) => {
    event.preventDefault();
    setEmailError(null);
    if (emailSaving || !emailValidation.validate()) return;

    setEmailSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser(
      { email: emailForm.newEmail.trim() },
      {
        emailRedirectTo: `${window.location.origin}/mi-cuenta?tab=perfil&subtab=access-data`,
      }
    );
    setEmailSaving(false);

    if (error) {
      setEmailError(translateAuthError(error.message));
      return;
    }

    // El email todavía no cambió — recién lo hace cuando se confirma el
    // link (ver el listener de USER_UPDATED más arriba).
    setPopup({
      title: "Revisá tu email",
      message:
        "Te enviamos un link de confirmación a la nueva dirección. El cambio no se aplica hasta que lo confirmes.",
    });
    cancelEmailChange();
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();
    setPasswordError(null);
    if (passwordSaving || !passwordValidation.validate()) return;

    setPasswordSaving(true);
    const supabase = createClient();

    // Supabase no pide la contraseña actual para updateUser() por defecto
    // (ya hay sesión activa) — la validamos nosotros reautenticando con
    // ella; si está mal, esto falla.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: passwordForm.currentPassword,
    });

    if (signInError) {
      setPasswordSaving(false);
      setPasswordError("La contraseña actual no es correcta.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    });
    setPasswordSaving(false);

    if (error) {
      setPasswordError(translateAuthError(error.message));
      return;
    }

    setPopup({
      title: "Contraseña guardada",
      message: "Tu contraseña fue actualizada con éxito. Usala la próxima vez que inicies sesión.",
    });
    cancelPasswordChange();
  };

  return (
    <div className="relative flex flex-col ">
      <div className="flex flex-col">

        {openSection !== "email" && (
          <>
            <p className="by-sm font-normal! px-5 py-3.75">{currentEmail}</p>
            <Button
              copy="Cambiar mail"
              variant="primary"
              onClick={() => setOpenSection("email")}
              className="bg-primary-03! border-y!  border-primary-00! text-primary-00! font-normal! hover:bg-primary-00! hover:text-primary-03!"
            />
          </>
        )}
        <motion.div
          initial={false}
          animate={{
            height: openSection === "email" ? emailHeight : 0,
            opacity: openSection === "email" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <form
            ref={emailContentRef}
            noValidate
            onSubmit={handleSaveEmail}
            className="flex flex-col"
          >
            {[
              ["currentEmailInput", "Mail actual"],
              ["newEmail", "Mail nuevo"],
              ["confirmNewEmail", "Confirmar mail nuevo"],
            ].map(([name, label]) => (
              <div key={name} className="flex flex-col border-b border-primary-01">
                <input
                  id={name}
                  type="email"
                  placeholder={label}
                  value={emailForm[name]}
                  onChange={setEmailField(name)}
                  onBlur={() => emailValidation.touch(name)}
                  aria-invalid={Boolean(emailErrors[name])}
                  className="by-sm bg-transparent px-5 py-3.75 outline-none"
                />
                <FieldError message={emailErrors[name]} />
              </div>
            ))}

            <FieldError message={emailError} className="pt-2" />

            <div className="flex flex-col gap-px">
              <Button
                copy={emailSaving ? "Guardando..." : "Guardar cambios"}
                type="submit"
                variant="primary"
                disabled={emailSaving || !emailValidation.isValid}
              />
              <Button
                copy="Cancelar"
                variant="primary"
                onClick={cancelEmailChange}
                disabled={emailSaving}
                className="bg-primary-03! border-y!  border-primary-00! text-primary-00! font-normal! hover:bg-primary-00! hover:text-primary-03!"
              />
            </div>
          </form>
        </motion.div>
      </div>

      <div className="flex flex-col">

        {openSection !== "password" && (
          <>
            <div className="flex items-center gap-2 px-5 py-3.75">
              <p className="by-sm ">
                {showMaskedPassword
                  ? "No es posible mostrar la contraseña actual"
                  : "••••••••"}
              </p>

            </div>
            <Button
              copy="Cambiar contraseña"
              variant="primary"
              onClick={() => setOpenSection("password")}
              className="bg-primary-03! border-y!  border-primary-00! text-primary-00! font-normal! hover:bg-primary-00! hover:text-primary-03!"
            />
          </>
        )}
        <motion.div
          initial={false}
          animate={{
            height: openSection === "password" ? passwordHeight : 0,
            opacity: openSection === "password" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <form
            ref={passwordContentRef}
            noValidate
            onSubmit={handleSavePassword}
            className="flex flex-col"
          >
            <PasswordField
              id="currentPassword"
              label="Contraseña actual"
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={setPasswordField("currentPassword")}
              onBlur={() => passwordValidation.touch("currentPassword")}
              error={passwordErrors.currentPassword}
              show={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword((value) => !value)}
            />

            <PasswordField
              id="newPassword"
              label="Contraseña nueva"
              value={passwordForm.newPassword}
              onChange={setPasswordField("newPassword")}
              onBlur={() => passwordValidation.touch("newPassword")}
              error={passwordErrors.newPassword}
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword((value) => !value)}
            />

            <PasswordField
              id="confirmNewPassword"
              label="Confirmar contraseña nueva"
              value={passwordForm.confirmNewPassword}
              onChange={setPasswordField("confirmNewPassword")}
              onBlur={() => passwordValidation.touch("confirmNewPassword")}
              error={passwordErrors.confirmNewPassword}
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword((value) => !value)}
            />

            <FieldError message={passwordError} className="pt-2" />

            <div className="flex flex-col gap-px">
              <Button
                copy={passwordSaving ? "Guardando..." : "Guardar cambios"}
                type="submit"
                variant="primary"
                disabled={passwordSaving || !passwordValidation.isValid}
              />
              <Button
                copy="Cancelar"
                variant="primary"
                onClick={cancelPasswordChange}
                disabled={passwordSaving}
                className="bg-primary-03! border-y!  border-primary-00! text-primary-00! font-normal! hover:bg-primary-00! hover:text-primary-03!"
              />
            </div>
          </form>
        </motion.div>
      </div>

      {popup && (
        <div data-lenis-prevent className="fixed inset-x-0 bottom-0 top-12.5 lg:top-0 z-50 bg-primary-00/40 flex items-center justify-center">
          <div className="bg-primary-03 h-full lg:h-[70%] w-full lg:w-[30%] px-5 lg:px-0 flex flex-col items-center justify-between  py-12.5">
            <div className="flex flex-col justify-center h-full max-w-74 gap-5.5">
            <p className="hl-sm max-lg:text-[1.5625rem]! max-lg:leading-8.25! uppercase text-center">{popup.title}</p>
            <p className="by-sm text-secondary-02 text-center">{popup.message}</p>
            </div>
            <Button
              copy="Continuar a perfil"
              variant="tertiary"
              onClick={() => setPopup(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessDataForm;
