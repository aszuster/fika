"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "@/utils/lenis";
import { MOBILE_QUERY } from "@/hooks/useIsMobile";
import Close from "@/svg/Close";

// Botón "Menu" que, con el menú abierto, se cambia por una cruz para cerrarlo.
export const MenuToggle = ({ isOpen, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
    className="relative h-full w-12.5  flex items-center justify-center cursor-pointer"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={isOpen ? "close" : "menu"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="flex items-center justify-center font-mono text-primary-00 text-[15px] uppercase"
      >
        {isOpen ? <Close /> : "Menú"}
      </motion.span>
    </AnimatePresence>
  </button>
);

// Panel de pantalla completa que baja debajo de la navbar (solo mobile).
const MobileMenu = ({ isOpen, onClose, items, pathname, isLoggedIn }) => {
  const lenis = useLenis();

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Si se agranda la pantalla a desktop, el menú se cierra solo.
    const mobile = window.matchMedia(MOBILE_QUERY);
    const handleResize = (event) => !event.matches && onClose();
    mobile.addEventListener("change", handleResize);

    return () => {
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
      mobile.removeEventListener("change", handleResize);
    };
  }, [isOpen, lenis, onClose]);

  const accountItems = [
    isLoggedIn
      ? { label: "Mi cuenta", url: "/mi-cuenta" }
      : { label: "Iniciar sesión", url: "/ingresar" },
  ];

  // Contenido de cada ítem (el <li> lo pone quien lo usa). textSize: tamaño
  // de la tipografía, por si un ítem necesita otro distinto al de las secciones.
  const renderLink = (
    { label, url, isActive, disabled },
    { textSize = "text-[25px]" } = {},
  ) => {
    const base = `flex items-center justify-center w-full font-mono ${textSize} uppercase py-3.75 font-light`;

    if (disabled) {
      return (
        <span
          aria-disabled="true"
          className={`${base} text-secondary-02 cursor-default select-none`}
        >
          {label}
        </span>
      );
    }

    const active = isActive ? isActive(pathname) : pathname === url;

    // La sección en la que estamos se marca con fondo negro y texto blanco.
    return (
      <Link
        href={url}
        onClick={onClose}
        aria-current={active ? "page" : undefined}
        className={`${base} ${
          active ? "bg-primary-00 text-primary-03" : "text-primary-00"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          data-lenis-prevent
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          className="lg:hidden fixed top-12.5 inset-x-0 h-[calc(100dvh-3.125rem)] overflow-y-auto overscroll-contain bg-primary-03 pb-[env(safe-area-inset-bottom)] flex flex-col justify-between"
        >
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.04, delayChildren: 0.15 },
              },
            }}
          >
            {items.map((item) => (
              <motion.li
                key={item.label}
                className="border-b border-primary-01 text-center font-light"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderLink(item)}
              </motion.li>
            ))}
            {accountItems.map((item) => (
              <li key={item.label} className="border-y border-primary-00">
                {renderLink(item, { textSize: "text-[15px]" })}
              </li>
            ))}
          </motion.ul>

          <ul
            className={`border-t  border-primary-01 font-mono text-[15px] font-normal uppercase`}
          >
            <li className="py-3.75 text-center"><a href="">Instagram</a></li>
            <li className="border-t border-primary-01 py-3.75 text-center">
              <a href="mailto:info@fikarevestimientos.com">info@fikarevestimientos.com</a>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
