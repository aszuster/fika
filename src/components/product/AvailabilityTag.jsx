const AvailabilityTag = ({ available }) => (
  <div
    className={`${available ? "border border-primary-00 px-1 lg:px-1" : "bg-primary-01 px-1 lg:px-2"} py-0 lg:py-0.5 rounded-sm w-auto h-auto`}
  >
    <p className="hl-xs uppercase h-auto whitespace-nowrap">
      {available ? "Disponible" : "A consultar"}
    </p>
  </div>
);

export default AvailabilityTag;
