export default function Chevron({
  width = "16",
  height = "8",
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
      <path
        d="M0.353515 16.3535L8.35352 8.35352L0.353515 0.353515"
        stroke={color}
      />
    </svg>
  );
}
