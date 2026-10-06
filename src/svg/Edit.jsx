export default function Edit({
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
<path d="M0.5 16.707V13.9484L13.7414 0.707031L16.5 3.46565L3.25862 16.707H0.5Z" stroke={color}/>

    </svg>
  );
}
