export default function Plus({
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
    >
      <circle cx="12" cy="12" r="11.5" stroke={color} />
      <path d="M11.9971 5.4541V18.545" stroke={color} />
      <path d="M5.4541 12L18.545 12" stroke={color} />
    </svg>
  );
}
