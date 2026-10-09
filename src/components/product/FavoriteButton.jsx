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
    {isFavorited ? <Minus/> : <Plus/>}
  </button>
);

export default FavoriteButton;
