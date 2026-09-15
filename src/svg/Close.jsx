export default function Close({
  width = "16",
  height = "16",
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
      <path d="M0.353516 0.353516L16.3535 16.3535" stroke={color} />
      <path d="M0.353516 16.3535L16.3535 0.353514" stroke={color} />
    </svg>
  );
}
