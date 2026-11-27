"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Chevron from "@/svg/Chevron";

// Mobile: en vez de los tabs, una barra con el nombre de la sección activa (o
// mobileLabel, "Mi cuenta", si no hay ninguna) que al tocarla despliega las
// secciones debajo. Los nombres van a 25px. La sección activa se marca con fondo
// negro, igual que en el menú mobile del navbar.
const TabMenu = ({ tabs, activeTab, onSelect, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const currentLabel =
    tabs.find(({ key }) => key === activeTab)?.label ?? label;

  const select = (key) => {
    setIsOpen(false);
    onSelect(key);
  };

  return (
    <div className="lg:hidden relative z-30 w-full h-12.5 border-b border-primary-00 bg-primary-03">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={listId}
        className="w-full h-full flex items-center justify-between px-3.75 btn-sm text-[1.5625rem]! uppercase cursor-pointer"
      >
        {currentLabel}
        <span
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "-rotate-90" : "rotate-90"
          }`}
        >
          <Chevron />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Tocar afuera cierra el menú. */}
            <div
              aria-hidden="true"
              className="fixed inset-0 -z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.ul
              id={listId}
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-full inset-x-0 bg-primary-03 border-b border-primary-00"
            >
              {tabs.map(({ key, label: tabLabel }) => {
                const active = activeTab === key;
                return (
                  <li key={key} className="border-b border-primary-01 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => select(key)}
                      aria-current={active ? "page" : undefined}
                      className={`w-full h-12.5 flex items-center justify-center btn-sm text-[1.5625rem]! uppercase cursor-pointer transition-colors duration-300 ${
                        active
                          ? "bg-primary-00 text-primary-03"
                          : "text-primary-00"
                      }`}
                    >
                      {tabLabel}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabBar = ({
  tabs,
  className,
  activeTab,
  onSelect,
  fullWidth = true,
  mobileLabel,
}) => {
  const tabsRow = (
    <div className={`${className} w-full h-full flex items-center justify-center gap-px border-x border-primary-00 bg-primary-00`}>
      {tabs.map(({ key, label }) => (
        <div
          key={key}
          className="w-full h-full flex items-center justify-center bg-primary-03"
        >
          <button
            type="button"
            onClick={() => onSelect(key)}
            className={`btn-sm border px-1.25 rounded-sm cursor-pointer transition-colors duration-300 ease-in-out ${
              activeTab === key
                ? "border-primary-00"
                : "border-transparent text-primary-00"
            }`}
          >
            {label}
          </button>
        </div>
      ))}
    </div>
  );

  // fullWidth=false: la barra ya vive adentro de una columna angosta, así
  // que no hace falta ese espacio vacío extra (PerfilSection).
  if (!fullWidth) {
    return (
      <div className="flex w-full h-12.5 border-b border-primary-00">
        {tabsRow}
      </div>
    );
  }

  // fullWidth=true: la barra ocupa toda la página y deja libres los costados
  // (AccountTabs, donde conviven con las grillas decorativas a los lados).
  // Con mobileLabel, en mobile se reemplaza por el menú desplegable.
  return (
    <>
      {mobileLabel && (
        <TabMenu
          tabs={tabs}
          activeTab={activeTab}
          onSelect={onSelect}
          label={mobileLabel}
        />
      )}
      <div
        className={`${mobileLabel ? "hidden lg:flex" : "flex"} w-full relative h-12.5 border-b border-primary-00`}
      >
        <div className="w-full"></div>
        {tabsRow}
        <div className="w-full"></div>
      </div>
    </>
  );
};

export default TabBar;
