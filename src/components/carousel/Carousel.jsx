"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue } from "motion/react";

// Cuánto hay que arrastrar (fracción del ancho) o qué tan rápido (px/s) para
// pasar de foto; si no, vuelve a la actual.
const SWIPE_DISTANCE = 0.2;
const SWIPE_VELOCITY = 500;

const slideTransition = { duration: 0.35, ease: "easeInOut" };

const Carousel = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const hasMany = images.length > 1;

  // El desplazamiento de la tira se calcula en px, así que necesitamos el
  // ancho real del contenedor (y actualizarlo si cambia el tamaño).
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controls = animate(x, -index * width, slideTransition);
    return () => controls.stop();
  }, [index, width, x]);

  if (images.length === 0) return null;

  const handleDragEnd = (_event, { offset, velocity }) => {
    const passedDistance = Math.abs(offset.x) > width * SWIPE_DISTANCE;
    const passedVelocity = Math.abs(velocity.x) > SWIPE_VELOCITY;
    const direction = offset.x < 0 ? 1 : -1;
    const next = Math.min(
      Math.max(index + direction, 0),
      images.length - 1,
    );

    if ((passedDistance || passedVelocity) && next !== index) {
      setIndex(next);
    } else {
      // No alcanzó para cambiar de foto (o es un extremo): vuelve a su lugar.
      animate(x, -index * width, slideTransition);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div ref={containerRef} className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div
          className={`flex h-full ${
            hasMany ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          style={{ x }}
          drag={hasMany ? "x" : false}
          dragConstraints={{ left: -(images.length - 1) * width, right: 0 }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative h-full w-full shrink-0">
              <Image
                src={src}
                alt=""
                fill
                sizes="25vw"
                draggable={false}
                className="object-contain pointer-events-none select-none"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {hasMany && (
        <div className="shrink-0 flex justify-center gap-2 py-4">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a la foto ${i + 1}`}
              aria-current={i === index}
              className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                i === index ? "bg-primary-00" : "bg-primary-01"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
