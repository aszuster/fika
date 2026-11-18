export default function Filter({
  width = "20",
  height = "14",
  color = "#2A2A2A",
  className = "",
}) {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="14"  viewBox={`0 0 ${width} ${height}`} fill="none" className={className}>
<path d="M0 2H20" stroke={color}/>
<path d="M0 7H20" stroke={color}/>
<path d="M0 12H20" stroke={color}/>
<circle cx="4" cy="7" r="2" fill={color}/>
<circle cx="16" cy="2" r="2" fill={color}/>
<circle cx="11" cy="12" r="2" fill={color}/>
</svg>
  );
}
