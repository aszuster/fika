export default function CirclePoint({
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
<circle cx="12" cy="12" r="11.5" stroke={color}/>
<circle cx="12" cy="12" r="3" fill={color}/>
    </svg>
  );
}
