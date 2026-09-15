export default function Visible({
  width = "24",
  height = "15.529",
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
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 16.0294C16.9188 16.0294 20.9188 13.4412 24.5 8.26471C20.9188 3.08824 16.9188 0.5 12.5 0.5C8.08118 0.5 4.08118 3.08824 0.5 8.26471C4.08118 13.4412 8.08118 16.0294 12.5 16.0294Z" stroke={color} stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.502 3.8208C14.9546 3.82092 16.9434 5.80949 16.9434 8.26221C16.9432 10.7148 14.9546 12.7035 12.502 12.7036C10.0492 12.7036 8.06067 10.7149 8.06055 8.26221C8.06055 5.80941 10.0492 3.8208 12.502 3.8208Z" stroke={color}/>
</svg>
  );
}
