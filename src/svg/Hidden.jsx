export default function Hidden({
  width = "25",
  height = "19",
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
<path fillRule="evenodd" clipRule="evenodd" d="M12.5 16.901C16.9188 16.901 20.9188 14.3128 24.5 9.13629C20.9188 3.95982 16.9188 1.37158 12.5 1.37158C8.08118 1.37158 4.08118 3.95982 0.5 9.13629C4.08118 14.3128 8.08118 16.901 12.5 16.901Z" stroke="#2A2A2A" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12.502 4.69238C14.9546 4.69251 16.9434 6.68107 16.9434 9.13379C16.9432 11.5864 14.9546 13.5751 12.502 13.5752C10.0492 13.5752 8.06067 11.5865 8.06055 9.13379C8.06055 6.681 10.0492 4.69238 12.502 4.69238Z" stroke="#2A2A2A"/>
<path d="M2.5 18.3716L22.5 0.371582" stroke={color}/>
</svg>
  );
}
