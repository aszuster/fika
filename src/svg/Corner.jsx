export default function Corner({
  width = "25",
  height = "25",
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
      className={className}
    >
      <path d="M2.5 27.5L2.5 2.5L27.5 2.5" strokeWidth="5" stroke={color} />
    </svg>
  );
}
