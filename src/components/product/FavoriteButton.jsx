"use client";
import Plus from "@/svg/Plus";
import Minus from "@/svg/Minus";

const FavoriteButton = ({ isFavorited, onToggle, className = "" }) => (
  <button
    type="button"
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onToggle();
    }}
    aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
    className={`group/icon z-10  flex items-center justify-center btn-sm cursor-pointer 
      

    ${className}`}
  >
    {/* Mobile: 20px en vez de 24px (el viewBox es de 24, así que escala). */}
    {isFavorited ? (
      <Minus className="max-lg:size-5" />
    ) : (
      <Plus className="max-lg:size-5" />
    )}
  </button>
);

export default FavoriteButton;
