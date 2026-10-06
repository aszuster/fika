const TabBar = ({ tabs, className, activeTab, onSelect, fullWidth = true }) => {
  const tabsRow = (
    <div className={`${className} w-full h-full flex items-center justify-center gap-px border-x border-primary-00 bg-primary-00`}>
      {tabs.map(({ key, label }) => (
        <div
          key={key}
          className="w-full h-full flex items-center justify-center bg-primary-03"
        >
          <button
            type="button"
            onClick={() => onSelect(key)}
            className={`btn-sm border px-1.25 rounded-sm cursor-pointer transition-colors duration-300 ease-in-out ${
              activeTab === key
                ? "border-primary-00"
                : "border-transparent text-primary-00"
            }`}
          >
            {label}
          </button>
        </div>
      ))}
    </div>
  );

  // fullWidth=true: la barra ocupa toda la página y deja libres los costados
  // (AccountTabs, donde conviven con las grillas decorativas a los lados).
  // fullWidth=false: la barra ya vive adentro de una columna angosta, así
  // que no hace falta ese espacio vacío extra (PerfilSection).
  if (!fullWidth) {
    return (
      <div className="flex w-full h-12.5 border-b border-primary-00">
        {tabsRow}
      </div>
    );
  }

  return (
    <div className="flex w-full relative h-12.5 border-b border-primary-00">
      <div className="w-full"></div>
      {tabsRow}
      <div className="w-full"></div>
    </div>
  );
};

export default TabBar;
