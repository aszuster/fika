"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import Chevron from "@/svg/Chevron";

const Carousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const goTo = (next) => setIndex((next + images.length) % images.length);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden">
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
              className="absolute -left-2.5 top-1/2 -translate-y-1/2 btn-sm cursor-pointer bg-primary-03/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-03 rotate-180"
            >
              <Chevron />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Foto siguiente"
              className="absolute -right-2.5 top-1/2 -translate-y-1/2 btn-sm cursor-pointer bg-primary-03/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-03"
            >
              <Chevron />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="shrink-0 flex justify-center gap-2 py-4">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a la foto ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full cursor-pointer ${
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
