"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { setIntroPlaying } from "@/utils/intro";
import { useLenis } from "@/utils/lenis";

// Medidas de la cruz, en px.
const LINE_WIDTH = 2;
const CROSS_SIZE = 130;
const CROSS_WIDTH = 20;

// Grilla de la pantalla blanca: 3 x 3, las medidas son sobre la pantalla entera.
const GRID_ROWS = "10% 1fr 10%";
const GRID_COLUMNS = "25% 1fr 25%";
const CENTER_CELL = 4;

// Tiempos de la secuencia, en segundos.
const LINE_DURATION = 0.9;
const SECOND_LINE_DELAY = 0.25;
const CROSS_GROW_DURATION = 0.45;
const CROSS_PAUSE = 0.9;
const REVEAL_DURATION = 0.5;
const LOGO_DELAY = 0.3; // pausa entre el fin de la apertura y el inicio del logo
const LOGO_DURATION = 0.8;
const SWEEP_DURATION = 0.9;

// Esperas, en ms.
const VIDEO_ONLY_MS = 1000; // video solo, antes de la primera línea
const VIDEO_START_MAX_MS = 2000; // si el video no arranca, la secuencia sigue igual
const LOGO_HOLD_MS = 1000; // logo completo, antes del barrido final
const PAGE_LOAD_MAX_MS = 8000; // tope de la espera de la carga; no corta animaciones
const REDUCED_MOTION_MS = 1200; // poster, con movimiento reducido

const EASE_IN_OUT = [0.76, 0, 0.24, 1];
const EASE_IN = [0.7, 0, 0.84, 0];

// Al volver atrás, el router puede restaurar una home que todavía trae el intro.
let hasPlayed = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Chrome puede precargar la página mientras se escribe la URL: sin esta espera,
// el intro correría oculto y dejaría la cookie sin que nadie lo vea.
const waitForActivation = () =>
  new Promise((resolve) => {
    if (document.prerendering) {
      document.addEventListener("prerenderingchange", resolve, { once: true });
    } else {
      resolve();
    }
  });

const waitForPageLoad = () =>
  new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });

// Cruz centrada en la pantalla: half es la mitad del grosor; arm, la mitad del largo.
const crossPolygon = ([half, arm]) => {
  const near = (offset) => `calc(50% - ${offset}px)`;
  const far = (offset) => `calc(50% + ${offset}px)`;

  return `polygon(${[
    [near(half), near(arm)],
    [far(half), near(arm)],
    [far(half), near(half)],
    [far(arm), near(half)],
    [far(arm), far(half)],
    [far(half), far(half)],
    [far(half), far(arm)],
    [near(half), far(arm)],
    [near(half), far(half)],
    [near(arm), far(half)],
    [near(arm), near(half)],
    [near(half), near(half)],
  ]
    .map((point) => point.join(" "))
    .join(", ")})`;
};

// Tapa la home mientras carga. Sobre el video se dibujan las líneas, nace la
// cruz y, con su forma, se abre la pantalla blanca. El barrido final espera a
// que la página esté lista.
export default function Intro({ cookieName }) {
  const videoRef = useRef(null);
  const [alreadyPlayed] = useState(() => hasPlayed);
  const [isFinished, setIsFinished] = useState(alreadyPlayed);
  const lenis = useLenis();

  const verticalLine = useMotionValue(0);
  const horizontalLine = useMotionValue(0);
  const crossHalf = useMotionValue(LINE_WIDTH / 2);
  const crossArm = useMotionValue(0);
  const logoHidden = useMotionValue(100);
  const sweep = useMotionValue(0);
  const opacity = useMotionValue(1);

  const crossClipPath = useTransform([crossHalf, crossArm], crossPolygon);
  const logoClipPath = useMotionTemplate`inset(0 0 ${logoHidden}% 0)`;
  const sweepClipPath = useMotionTemplate`inset(0 0 ${sweep}% 0)`;

  useEffect(() => {
    if (alreadyPlayed) return;

    let isCancelled = false;
    let playback;

    const play = (...args) => {
      playback = animate(...args);
      return playback;
    };

    const playSequence = async (pageReady) => {
      // Autoplay exige muted, y hay que fijarlo acá: el atributo puede no
      // llegar en el HTML del servidor.
      videoRef.current.muted = true;
      await Promise.race([
        videoRef.current.play().catch(() => {}),
        wait(VIDEO_START_MAX_MS),
      ]);
      await wait(VIDEO_ONLY_MS);
      if (isCancelled) return;

      // Con este grosor, los brazos cubren la pantalla en cualquier proporción.
      const coverHalf = Math.max(window.innerWidth, window.innerHeight) / 2;
      const coverArm = coverHalf * (CROSS_SIZE / CROSS_WIDTH);

      await play([
        [verticalLine, 1, { duration: LINE_DURATION, ease: EASE_IN_OUT }],
        [
          horizontalLine,
          1,
          { duration: LINE_DURATION, ease: EASE_IN_OUT, at: SECOND_LINE_DELAY },
        ],
      ]);
      if (isCancelled) return;

      // Mismo grosor que las líneas: la cruz aparece sin que se note.
      crossArm.set(CROSS_SIZE / 2);

      await play([
        [
          crossHalf,
          CROSS_WIDTH / 2,
          { duration: CROSS_GROW_DURATION, ease: EASE_IN_OUT },
        ],
        [
          crossHalf,
          coverHalf,
          { duration: REVEAL_DURATION, ease: EASE_IN, at: `+${CROSS_PAUSE}` },
        ],
        [crossArm, coverArm, { duration: REVEAL_DURATION, ease: EASE_IN, at: "<" }],
      ]);

      if (isCancelled) return;

      await play(logoHidden, 0, {
        delay: LOGO_DELAY,
        duration: LOGO_DURATION,
        ease: EASE_IN_OUT,
      });

      await Promise.all([pageReady, wait(LOGO_HOLD_MS)]);
      if (isCancelled) return;

      await play(sweep, 100, { duration: SWEEP_DURATION, ease: EASE_IN_OUT });
    };

    const playReduced = async (pageReady) => {
      await Promise.all([pageReady, wait(REDUCED_MOTION_MS)]);
      if (isCancelled) return;

      await play(opacity, 0, { duration: 0.6, ease: "easeInOut" });
    };

    const run = async () => {
      await waitForActivation();
      if (isCancelled) return;

      const pageReady = Promise.race([
        Promise.all([waitForPageLoad(), document.fonts.ready]),
        wait(PAGE_LOAD_MAX_MS),
      ]);
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      await (isReduced ? playReduced(pageReady) : playSequence(pageReady));
      if (!isCancelled) setIsFinished(true);
    };

    run();

    return () => {
      isCancelled = true;
      playback?.stop();
    };
  }, [
    alreadyPlayed,
    verticalLine,
    horizontalLine,
    crossHalf,
    crossArm,
    logoHidden,
    sweep,
    opacity,
  ]);

  useEffect(() => {
    if (isFinished) return;

    setIntroPlaying(true);
    lenis?.stop();

    return () => {
      setIntroPlaying(false);
      lenis?.start();
    };
  }, [isFinished, lenis]);

  useEffect(() => {
    if (!isFinished) return;

    hasPlayed = true;
    // Sin max-age: dura lo que la sesión del navegador.
    document.cookie = `${cookieName}=1; path=/; samesite=lax`;
  }, [isFinished, cookieName]);

  if (isFinished) return null;

  return (
    <motion.div
      aria-hidden
      style={{ clipPath: sweepClipPath, opacity }}
      className="fixed inset-0 z-50 bg-primary-03"
    >
      <video
        ref={videoRef}
        src="/video/intro-web.mp4"
        poster="/video/intro-poster.jpg"
        muted
        playsInline
        preload="auto"
        className="size-full object-cover"
      />

      <motion.div
        className="absolute inset-y-0 origin-top bg-primary-03"
        style={{
          left: `calc(50% - ${LINE_WIDTH / 2}px)`,
          width: LINE_WIDTH,
          scaleY: verticalLine,
        }}
      />
      <motion.div
        className="absolute inset-x-0 origin-left bg-primary-03"
        style={{
          top: `calc(50% - ${LINE_WIDTH / 2}px)`,
          height: LINE_WIDTH,
          scaleX: horizontalLine,
        }}
      />

      {/* Pantalla blanca: lo que vaya acá adentro se revela con la forma de la cruz. */}
      <motion.div
        className="absolute inset-0 grid gap-px bg-primary-00"
        style={{
          clipPath: crossClipPath,
          gridTemplateRows: GRID_ROWS,
          gridTemplateColumns: GRID_COLUMNS,
        }}
      >
        {Array.from({ length: 9 }, (_, index) =>
          index === CENTER_CELL ? (
            <div
              key={index}
              className="flex items-center justify-center bg-primary-03 px-[8%]"
            >
              <motion.div className="w-full" style={{ clipPath: logoClipPath }}>
                <Image
                  src="/img/logo_w_r.svg"
                  width={67}
                  height={25}
                  loading="eager"
                  className="w-full h-auto"
                  alt=""
                />
              </motion.div>
            </div>
          ) : (
            <div key={index} className="bg-primary-03" />
          ),
        )}
      </motion.div>
    </motion.div>
  );
}
