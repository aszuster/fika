"use client";

import { useEffect, useRef, useState } from "react";

// Alto mínimo del thumb, para que se pueda agarrar en contenidos muy largos.
const MIN_THUMB_HEIGHT = 40;

// Sin target, sigue el scroll de la página; con target (ref a un elemento),
// el de ese elemento. Lenis acompaña el scroll nativo, así que el arrastre
// mueve el scroll directo.
const getScroll = (target) => {
  if (!target) {
    const { scrollHeight, clientHeight } = document.documentElement;
    return { top: window.scrollY, scrollHeight, clientHeight };
  }
  const { scrollTop, scrollHeight, clientHeight } = target;
  return { top: scrollTop, scrollHeight, clientHeight };
};

const setScroll = (target, y) => {
  if (target) target.scrollTop = y;
  else window.scrollTo(0, y);
};

// Scrollbar dibujado encima del contenido (el nativo se oculta con
// no-scrollbar), así no le resta ancho a las columnas. La posición y el alto
// del track los define className.
export default function Scrollbar({ targetRef, className = "" }) {
  const trackRef = useRef(null);
  const dragStart = useRef(null);
  const [thumb, setThumb] = useState({ top: 0, height: 0, visible: false });
  const [isDragging, setIsDragging] = useState(false);

  const getMetrics = () => {
    const target = targetRef?.current;
    const { top, scrollHeight, clientHeight } = getScroll(target);
    const trackHeight = trackRef.current?.clientHeight ?? 0;
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * trackHeight,
      MIN_THUMB_HEIGHT,
    );
    return {
      target,
      top,
      maxScroll: scrollHeight - clientHeight,
      maxThumbTop: trackHeight - thumbHeight,
      thumbHeight,
    };
  };

  useEffect(() => {
    const target = targetRef?.current;
    if (targetRef && !target) return;

    const update = () => {
      const { top, maxScroll, maxThumbTop, thumbHeight } = getMetrics();
      // 1px de tolerancia por redondeos de alturas fraccionarias.
      const visible = maxScroll > 1;
      setThumb({
        top: visible ? (top / maxScroll) * maxThumbTop : 0,
        height: thumbHeight,
        visible,
      });
    };

    update();
    const scroller = target ?? window;
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // El alto del contenido cambia sin resize (filtros, vista, pestañas…).
    const content = target ?? document.body;
    const resizeObserver = new ResizeObserver(update);
    const observeChildren = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(content);
      for (const child of content.children) resizeObserver.observe(child);
    };
    observeChildren();
    const mutationObserver = new MutationObserver(() => {
      observeChildren();
      update();
    });
    mutationObserver.observe(content, { childList: true });

    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [targetRef]);

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { y: event.clientY, scroll: getMetrics().top };
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragStart.current) return;
    const { target, maxScroll, maxThumbTop } = getMetrics();
    const delta = event.clientY - dragStart.current.y;
    setScroll(target, dragStart.current.scroll + (delta / maxThumbTop) * maxScroll);
  };

  const handlePointerUp = () => {
    dragStart.current = null;
    setIsDragging(false);
  };

  // Click en el track: salta a esa posición, centrando el thumb.
  const handleTrackClick = (event) => {
    if (event.target !== event.currentTarget) return;
    const { target, maxScroll, maxThumbTop, thumbHeight } = getMetrics();
    const trackTop = trackRef.current.getBoundingClientRect().top;
    const thumbTop = Math.min(
      Math.max(event.clientY - trackTop - thumbHeight / 2, 0),
      maxThumbTop,
    );
    setScroll(target, (thumbTop / maxThumbTop) * maxScroll);
  };

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      aria-hidden
      className={`group z-30 w-3 ${
        thumb.visible ? "" : "invisible pointer-events-none"
      } ${className}`}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
        className={`absolute right-0.5 w-1.5 rounded-full cursor-grab transition-[width,background-color] duration-200 ease-in-out group-hover:w-2 ${
          isDragging
            ? "w-2 bg-primary-00 cursor-grabbing"
            : "bg-primary-00/40 hover:bg-primary-00/70"
        }`}
      />
    </div>
  );
}
