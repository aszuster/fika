"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/buttons/Button";
import GridFillers from "@/components/grid/GridFillers";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import useIsMobile from "@/hooks/useIsMobile";
import Close from "@/svg/Close";
import Chevron from "@/svg/Chevron";

const emptySelection = {
  color: [],
  material: [],
  format: [],
  application: [],
};


const wordSelectClass = (isSelected) =>
  `border rounded-[3px] p-1 -m-1 transition-colors duration-300 ease-in-out ${
    isSelected ? "border-primary-00" : "border-transparent"
  }`;

function FilterSection({
  title,
  items,
  borderTop,
  getValue = (item) => item,
  selected,
  onToggle,
  renderItem,
}) {
  // En mobile cada categoría es un acordeón de una columna; en desktop, una grilla de 2.
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();

  const options = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-primary-01">
      {items.map((item, index) => {
        const value = getValue(item);
        const isSelected = selected.includes(value);

        return (
          <button
            key={index}
            type="button"
            onClick={() => onToggle(value)}
            aria-pressed={isSelected}
            className="h-12.5 flex w-full items-center px-3.75 lg:px-7.5 text-left cursor-pointer bg-primary-03 hover:bg-primary-02"
          >
            {renderItem(item, isSelected)}
          </button>
        );
      })}
      {!isMobile && <GridFillers items={items} cols={2} />}
    </div>
  );

  if (isMobile) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsExpanded((open) => !open)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className={`h-12.5 w-full flex justify-between items-center px-3.75 lg:px-7.25 border-b border-primary-00 cursor-pointer transition-colors duration-300 ease-in-out ${
            isExpanded
              ? "bg-primary-00 text-primary-03"
              : "bg-primary-03 text-primary-00"
          }`}
        >
          <p className="hl-xs uppercase">
            {title}
            {selected.length > 0 && ` (${selected.length})`}
          </p>
          <motion.span
            animate={{ rotate: isExpanded ? -90 : 90 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex"
          >
            {/* currentColor: el chevron toma el color del texto y transiciona con él. */}
            <Chevron color="currentColor" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              id={contentId}
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-b border-primary-00">{options}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`h-12.5 flex justify-center items-center border-b border-primary-00${
          borderTop ? " border-t" : ""
        }`}
      >
        <p className="hl-xs uppercase">{title}</p>
      </div>
      {options}
    </div>
  );
}


const FiltersPanel = ({
  options,
  initialSelection = emptySelection,
  isOpen,
  onApply,
  onClear,
  onClose,
}) => {
  const { colors, materials, formats, applications } = options;
  const [draft, setDraft] = useState(initialSelection);

  const toggle = (category, value) => {
    setDraft((prev) => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const handleClear = () => {
    setDraft(emptySelection);
    onClear?.();
  };

  const handleApply = () => {
    onApply?.(draft);
  };

  return (
    <motion.div
      initial={false}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="absolute top-0 left-0 w-full lg:w-160 bg-primary-03 h-[calc(100dvh-3.125rem)] lg:border-r border-primary-00 flex flex-col"
    >
      <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center justify-between px-3.75 lg:px-7.5">
        <p className="hl-xs uppercase border rounded-sm px-1.5">Filtros</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar filtros"
          className="cursor-pointer"
        >
          <Close />
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="lg:border-b border-primary-00">
        <FilterSection
          title="Color"
          items={colors}
          getValue={(item) => item.label}
          selected={draft.color}
          onToggle={(value) => toggle("color", value)}
          renderItem={({ label, hex }, isSelected) => {
            const isWhite = label === "Blanco";

            return (
              <div className="flex w-full items-center justify-between">
                <p className={`by-sm ${wordSelectClass(isSelected)}`}>{label}</p>
                <div
                  className={`w-5.5 h-5.5 rounded-full flex justify-center items-center ${
                    isWhite ? "border border-primary-00" : ""
                  }`}
                  style={{ backgroundColor: hex }}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      isWhite ? "bg-primary-00" : "bg-primary-03"
                    }`}
                  ></div>
                </div>
              </div>
            );
          }}
        />
        <FilterSection
          title="Material"
          items={materials}
          borderTop
          selected={draft.material}
          onToggle={(value) => toggle("material", value)}
          renderItem={(label, isSelected) => (
            <p className={`by-sm ${wordSelectClass(isSelected)}`}>{label}</p>
          )}
        />
        <FilterSection
          title="Formato"
          items={formats}
          borderTop
          getValue={(item) => item.label}
          selected={draft.format}
          onToggle={(value) => toggle("format", value)}
          renderItem={({ label, note }, isSelected) => (
            <p className={`by-sm ${wordSelectClass(isSelected)}`}>
              {label} <span className="text-secondary-02">{note}</span>
            </p>
          )}
        />
        <FilterSection
          title="Aplicación"
          items={applications}
          borderTop
          selected={draft.application}
          onToggle={(value) => toggle("application", value)}
          renderItem={(label, isSelected) => (
            <p className={`by-sm ${wordSelectClass(isSelected)}`}>{label}</p>
          )}
        />
        </div>
      </ScrollArea>
      <div className="w-full h-18 shrink-0 border-t border-primary-00 flex">
        <div className="w-full flex justify-center items-center border-r border-primary-00">
          <Button copy="Borrar" variant="tertiary" onClick={handleClear} />
        </div>
        <div className="w-full flex justify-center items-center">
          <Button copy="Aplicar" variant="tertiary" onClick={handleApply} />
        </div>
      </div>
    </motion.div>
  );
};

export default FiltersPanel;
