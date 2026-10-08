"use client";

import { useLenis } from "@/utils/lenis";

export default function BackToTop({ className = "" }) {
  const lenis = useLenis();

  const handleClick = (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a href="#" onClick={handleClick} className={className}>
      Back to top ↑
    </a>
  );
}
