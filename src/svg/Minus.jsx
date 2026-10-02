export default function Minus({
  width = "24",
  height = "24",
  color = "#2A2A2A",
  className = "",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={`group/icon ${className}`}
    >
      <circle cx="12" cy="12" r="11.5" stroke={color} className="transition-colors duration-300 ease-in-out group-hover/icon:fill-primary-00 group-hover/icon:stroke-primary-00" />
      <path d="M5.4541 12L18.545 12" stroke={color} className="transition-colors duration-300 ease-in-out group-hover/icon:stroke-primary-03" />
    </svg>
  );
}
