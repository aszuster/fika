"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const Carousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const goTo = (next) => setIndex((next + images.length) % images.length);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt=""
            fill
            sizes="25vw"
            className="object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 btn-sm cursor-pointer bg-primary-03/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-03"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-sm cursor-pointer bg-primary-03/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-03"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ir a la foto ${i + 1}`}
                className={`w-2 h-2 rounded-full cursor-pointer ${
                  i === index ? "bg-primary-00" : "bg-primary-01"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
