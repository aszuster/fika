"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import { translateAuthError } from "@/utils/supabase/authErrors";
import Visible from "@/svg/Visible";
import Hidden from "@/svg/Hidden";

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

const PasswordField = ({ id, label, value, onChange, show, onToggleShow }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 ">
      <input
        id={id}
        placeholder={label}
        type={show ? "text" : "password"}
        required
        autoComplete="new-password"
        value={value}
        onChange={onChange}
        className="by-sm bg-transparent outline-none flex-1 pl-5 py-3.75 "
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="by-sm text-secondary-02 cursor-pointer pr-5"
      >
        {show ? <Hidden/> : <Visible/>}
      </button>
    </div>
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

  // Solo para que la fila de "contraseña actual" tenga el mismo look que un
  // campo de contraseña — nunca es el valor real, nadie (ni nosotros, ni
  // Supabase) puede leer la contraseña ya guardada, solo su hash.
  const [showMaskedPassword, setShowMaskedPassword] = useState(false);

  const [popup, setPopup] = useState(null);

  // Medimos la altura real del contenido para poder animar el height entre
  // 0 y un número concreto en las dos direcciones — animar directo hacia/
  // desde "auto" con motion solo interpola bien al abrir, no al cerrar.
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

  const isEmailFormValid =
    emailForm.currentEmailInput.trim().toLowerCase() ===
      currentEmail.toLowerCase() &&
    emailForm.newEmail.trim() !== "" &&
    emailForm.newEmail !== currentEmail &&
    emailForm.confirmNewEmail === emailForm.newEmail;

  const isPasswordFormValid =
    passwordForm.currentPassword !== "" &&
    passwordForm.newPassword.length >= 6 &&
    passwordForm.confirmNewPassword === passwordForm.newPassword;

  // Explica por qué "Guardar cambios" está deshabilitado. Solo avisamos
  // sobre campos que ya se completaron, para no mostrar errores apenas se
  // abre el formulario vacío.
  const getEmailValidationError = () => {
    const currentEmailInput = emailForm.currentEmailInput.trim();
    if (
      currentEmailInput !== "" &&
      currentEmailInput.toLowerCase() !== currentEmail.toLowerCase()
    ) {
      return "El mail actual no es correcto.";
    }
    if (emailForm.newEmail.trim() !== "" && emailForm.newEmail === currentEmail) {
      return "El mail nuevo tiene que ser distinto al actual.";
    }
    if (
      emailForm.confirmNewEmail !== "" &&
      emailForm.confirmNewEmail !== emailForm.newEmail
    ) {
      return "Los mails no coinciden.";
    }
    return null;
  };

  const getPasswordValidationError = () => {
    if (
      passwordForm.newPassword !== "" &&
      passwordForm.newPassword.length < 6
    ) {
      return "La contraseña nueva tiene que tener al menos 6 caracteres.";
    }
    if (
      passwordForm.confirmNewPassword !== "" &&
      passwordForm.confirmNewPassword !== passwordForm.newPassword
    ) {
      return "Las contraseñas no coinciden.";
    }
    return null;
  };

  const emailMessage = getEmailValidationError() ?? emailError;
  const passwordMessage = getPasswordValidationError() ?? passwordError;

  const cancelEmailChange = () => {
    setOpenSection(null);
    setEmailForm(emptyEmailForm);
    setEmailError(null);
  };

  const cancelPasswordChange = () => {
    setOpenSection(null);
    setPasswordForm(emptyPasswordForm);
    setPasswordError(null);
  };

  const handleSaveEmail = async (event) => {
    event.preventDefault();
    setEmailError(null);
    if (!isEmailFormValid) return;

    setEmailSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser(
      { email: emailForm.newEmail },
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
    if (!isPasswordFormValid) return;

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
            onSubmit={handleSaveEmail}
            className="flex flex-col"
          >
            <div className="flex flex-col gap-1">
              <input
                id="currentEmailInput"
                type="email"
                placeholder="Mail actual"
                required
                value={emailForm.currentEmailInput}
                onChange={(event) =>
                  setEmailForm((prev) => ({
                    ...prev,
                    currentEmailInput: event.target.value,
                  }))
                }
                className="by-sm border-b border-primary-01 bg-transparent px-5 py-3.75 outline-none"
              />
            </div>

            <div className="flex flex-col ">
              <input
                id="newEmail"
                type="email"
                placeholder="Mail nuevo"
                required
                value={emailForm.newEmail}
                onChange={(event) =>
                  setEmailForm((prev) => ({
                    ...prev,
                    newEmail: event.target.value,
                  }))
                }
                className="by-sm border-b border-primary-01 bg-transparent px-5 py-3.75 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <input
                id="confirmNewEmail"
                type="email"
                placeholder="Confirmar mail nuevo"
                required
                value={emailForm.confirmNewEmail}
                onChange={(event) =>
                  setEmailForm((prev) => ({
                    ...prev,
                    confirmNewEmail: event.target.value,
                  }))
                }
                className="by-sm border-b border-primary-01 bg-transparent px-5 py-3.75 outline-none"
              />
            </div>

            {emailMessage && (
              <p className="by-sm text-[#A20000] px-5">{emailMessage}</p>
            )}

            <div className="flex flex-col gap-px">
              <Button
                copy={emailSaving ? "Guardando..." : "Guardar cambios"}
                type="submit"
                variant="primary"
                disabled={emailSaving || !isEmailFormValid}
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
            onSubmit={handleSavePassword}
            className="flex flex-col not-last:border-b not-last:border-primary-01"
          >
            <PasswordField
              id="currentPassword"
              label="Contraseña actual"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: event.target.value,
                }))
              }
              show={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword((value) => !value)}
            />

            <PasswordField
              id="newPassword"
              label="Contraseña nueva"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: event.target.value,
                }))
              }
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword((value) => !value)}
            />

            <PasswordField
              id="confirmNewPassword"
              label="Confirmar contraseña nueva"
              value={passwordForm.confirmNewPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmNewPassword: event.target.value,
                }))
              }
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword((value) => !value)}
            />

            {passwordMessage && (
              <p className="by-sm text-[#A20000] px-5">{passwordMessage}</p>
            )}

            <div className="flex flex-col gap-px">
              <Button
                copy={passwordSaving ? "Guardando..." : "Guardar cambios"}
                type="submit"
                variant="primary"
                disabled={passwordSaving || !isPasswordFormValid}
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
        <div className="fixed inset-0 z-20 bg-primary-00/40 flex items-center justify-center">
          <div className="bg-primary-03 h-[70%] w-[30%] flex flex-col items-center justify-between  py-12.5">
            <div className="flex flex-col justify-center h-full max-w-74 gap-5.5">
            <p className="hl-sm uppercase text-center">{popup.title}</p>
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
