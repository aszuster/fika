export default function Arrow({
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
<path d="M12 0.353515L24 12.3535L12 24.3535" stroke={color}/>
<path d="M24 12.3535L-3.57628e-07 12.3535" stroke={color}/>
</svg>
  );
}
