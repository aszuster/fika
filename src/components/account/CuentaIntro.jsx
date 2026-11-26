"use client";

import { useState } from "react";
import { motion } from "motion/react";

// Animación de entrada de "Mi cuenta" en mobile (las fases las maneja
// AccountTabs):
//   1. La pantalla se divide en 4 (las líneas se dibujan) y al medio aparece
//      una cruz titilando.
//   2. Se va la parte vertical de la cruz y la horizontal se abre en dos
//      líneas gruesas que viajan hasta el centro de las grillas de 2x4 que se
//      dibujan arriba y abajo (SplitGrid). La línea horizontal fina también se
//      abre en dos y entre ellas aparece "HOLA [nombre]".
//   3. AccountTabs desmonta este overlay con un fundido y debajo queda la vista
//      final, con las dos líneas en el mismo lugar.
// Las líneas copian la posición mobile de las de AccountTabs (±80px del
// centro = translate-y-20) para que el paso a la vista final no se note: si se
// cambia allá, cambiar LINE_OFFSET acá.

const EASE = [0.76, 0, 0.24, 1];
const LINE_OFFSET = 80;
// Columnas de los costados de la grilla de la pantalla 2 (las 2 del medio se
// reparten el resto).
const SIDE_COL = 138;

// Pantalla 2: grilla de 2 filas y 4 columnas (138px | 1fr | 1fr | 138px) en el
// espacio de arriba y de abajo de las líneas. La línea vertical del centro ya
// está desde la pantalla 1, así que aparece sin animación (en la franja del
// "Hola" se va); el resto se dibuja.
// Pantalla 1: la cruz titila al aparecer (después de dibujarse las líneas).
// Constantes fuera del componente para que no se reinicie en cada render.
// Primero aparece con fundido (CROSS_FADE_IN) y después parpadea: cada valor de
// FLICKER_STATES dura FLICKER_STEP y el salto al siguiente es instantáneo (el
// valor se repite y el cambio pasa en un instante casi nulo).
const CROSS_FADE_IN = 0.4; // s
const FLICKER_STATES = [1, 0, 1, 0, 1]; // después del fundido: queda, se va…
const FLICKER_STEP = 0.1; // s
const FLICKER_JUMP = 0.0001; // s
const FLICKER_DURATION = CROSS_FADE_IN + FLICKER_STATES.length * FLICKER_STEP;
const CROSS_FLICKER = {
  opacity: [0, ...FLICKER_STATES.flatMap((value) => [value, value])],
};
const CROSS_FLICKER_TRANSITION = {
  duration: FLICKER_DURATION,
  delay: 0.8,
  // Momentos en segundos, pasados a 0–1 como pide motion.
  times: [
    0,
    ...FLICKER_STATES.flatMap((_, i) => {
      const start = CROSS_FADE_IN + i * FLICKER_STEP;
      return [i === 0 ? start : start + FLICKER_JUMP, start + FLICKER_STEP];
    }),
  ].map((seconds) => seconds / FLICKER_DURATION),
  ease: "linear",
};
const CROSS_SIZE = 130; // largo de los brazos de la cruz (h-32.5)
const CROSS_BAR = 20; // grosor de los brazos (w-5)
const THICK_BAR = 15; // grosor de las líneas gruesas de la pantalla 2
// Pausa entre que se va la parte vertical y se abren las líneas.
const SPLIT_DELAY = 0.3;
const SPLIT_TRANSITION = { duration: 0.9, ease: EASE, delay: SPLIT_DELAY };

// Línea gruesa negra de la pantalla 2: en la pantalla 1 es el brazo horizontal
// de la cruz (achicada con scale) y en la 2 viaja al centro de su grilla y se
// estira a las 2 columnas del medio. El centro de cada grilla está a
// 25% + LINE_OFFSET / 2 del centro de la pantalla: el 25% lo mueve el
// contenedor (alto = pantalla) y los px la línea.
const ThickBar = ({ direction, isSplit }) => {
  // El overlay solo se monta en el cliente, así que window existe.
  const [barWidth] = useState(() => window.innerWidth - SIDE_COL * 2);

  return (
    <motion.div
      initial={false}
      animate={{ y: isSplit ? `${direction * 25}%` : "0%" }}
      transition={SPLIT_TRANSITION}
      className="absolute inset-0"
    >
      <motion.div
        initial={false}
        animate={
          isSplit
            ? { y: (direction * LINE_OFFSET) / 2, scaleX: 1, scaleY: 1 }
            : {
                y: 0,
                scaleX: CROSS_SIZE / barWidth,
                scaleY: CROSS_BAR / THICK_BAR,
              }
        }
        transition={SPLIT_TRANSITION}
        style={{ left: SIDE_COL, right: SIDE_COL, marginTop: -THICK_BAR / 2 }}
        className="absolute top-1/2 h-3.75 bg-primary-00"
      />
    </motion.div>
  );
};

const SplitGrid = ({ className, show }) => {
  const draw = (axis, delay) => ({
    initial: { [axis]: 0 },
    animate: { [axis]: show ? 1 : 0 },
    transition: { duration: 0.8, ease: EASE, delay: show ? delay : 0 },
  });

  return (
    <div className={`absolute inset-x-0 ${className}`}>
      <motion.div
        {...draw("scaleX", 0.3)}
        className="absolute inset-x-0 top-1/2 h-px bg-primary-01"
      />
      <motion.div
        {...draw("scaleY", 0.45)}
        style={{ left: SIDE_COL }}
        className="absolute inset-y-0 w-px bg-primary-01"
      />
      <motion.div
        {...draw("scaleY", 0.45)}
        style={{ right: SIDE_COL }}
        className="absolute inset-y-0 w-px bg-primary-01"
      />
      {show && (
        <div className="absolute inset-y-0 left-1/2 w-px -ml-px bg-primary-01" />
      )}
    </div>
  );
};

const CuentaIntro = ({ phase, name }) => {
  const isSplit = phase >= 2;

  return (
    <motion.div
      aria-hidden="true"
      // Paso a la pantalla 3: barrido de abajo hacia arriba (el overlay se
      // recorta desde abajo y va dejando ver la vista final).
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1.2, ease: EASE }}
      // Sube 50px (-top-12.5) para tapar también la zona de la barra de "Mi
      // cuenta": así la división en 4 es de toda la pantalla y su centro
      // coincide con el de la vista final.
      className="lg:hidden absolute inset-x-0 -top-12.5 bottom-0 z-40 bg-primary-03 overflow-hidden"
    >
      {/* Línea vertical: divide en 2 columnas. */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isSplit ? { scaleY: 1, opacity: 0 } : { scaleY: 1, opacity: 1 }}
        transition={
          isSplit
            ? { duration: 0.4, ease: "easeOut" }
            : { duration: 0.8, ease: EASE }
        }
        className="absolute inset-y-0 left-1/2 w-px -ml-px bg-primary-01"
      />

      {/* Línea horizontal: dos líneas superpuestas que en la fase 2 se separan. */}
      {[-1, 1].map((direction) => (
        <motion.div
          key={direction}
          initial={{ scaleX: 0, y: -1 }}
          animate={{
            scaleX: 1,
            y: isSplit ? (direction < 0 ? -LINE_OFFSET : LINE_OFFSET - 1) : -1,
          }}
          transition={{
            scaleX: { duration: 0.8, ease: EASE },
            y: { duration: 0.9, ease: EASE, delay: isSplit ? SPLIT_DELAY : 0 },
          }}
          className="absolute inset-x-0 top-1/2 h-px bg-primary-01"
        />
      ))}

      {/* Grillas de arriba y de abajo de las líneas (pantalla 2). */}
      {/* Alto: del borde hasta la línea (50% - LINE_OFFSET = 50% - 5rem). */}
      <SplitGrid show={isSplit} className="top-0 h-[calc(50%-5rem)]" />
      <SplitGrid show={isSplit} className="bottom-0 h-[calc(50%-5rem)]" />

      {/* Cruz del centro: aparece titilando (pantalla 1). En la pantalla 2 se
          va la parte vertical y la horizontal se abre en las dos líneas
          gruesas, que viajan hasta el centro de cada grilla. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={CROSS_FLICKER}
        transition={CROSS_FLICKER_TRANSITION}
        className="absolute inset-0"
      >
        <motion.div
          initial={false}
          animate={isSplit ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          className="absolute top-1/2 left-1/2 h-32.5 w-5 -translate-1/2 bg-primary-00"
        />
        {[-1, 1].map((direction) => (
          <ThickBar key={direction} direction={direction} isSplit={isSplit} />
        ))}
      </motion.div>

      {/* "HOLA [nombre]" entre las dos líneas. */}
      <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full px-5 overflow-hidden">
        <motion.p
          initial={{ y: "110%", opacity: 0 }}
          animate={isSplit ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: isSplit ? 0.6 : 0 }}
          className="hl-lg text-center uppercase"
        >
          Hola{name ? ` ${name}` : ""}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CuentaIntro;
