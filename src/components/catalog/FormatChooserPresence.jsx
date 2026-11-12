"use client";

import { AnimatePresence, motion } from "motion/react";

// Igual que el barrido final del intro.
const SWEEP_DURATION = 0.9;
const EASE_IN_OUT = [0.76, 0, 0.24, 1];

// Cuando el servidor deja de mandar la elección, la mantiene montada para
// barrerla hacia arriba: debajo ya está el catálogo.
export default function FormatChooserPresence({ children }) {
  return (
    <AnimatePresence>
      {children && (
        <motion.div
          key="format-chooser"
          initial={false}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: SWEEP_DURATION, ease: EASE_IN_OUT }}
          className="fixed inset-0 z-40"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
