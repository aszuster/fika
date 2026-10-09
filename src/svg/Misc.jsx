export default function Misc({
  width = "135",
  height = "20",
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
<path d="M10 4H135.291" strokeWidth="8" stroke={color}/>
<path d="M11.999 20L0 0H24L11.999 20Z 135" fill={color}/>
</svg>
  );
}
