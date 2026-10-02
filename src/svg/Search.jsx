export default function Search({
  width = "22.168",
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
<circle cx="8" cy="8" r="7.5" stroke={color}/>
<path d="M13.1084 13L22 20" stroke={color}/>
</svg>
  );
}
