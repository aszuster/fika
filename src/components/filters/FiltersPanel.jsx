"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import GridFillers from "@/components/grid/GridFillers";
import { colors, materials, formats, applications } from "@/data/filters";

const emptySelection = {
  color: [],
  material: [],
  format: [],
  application: [],
};

// Same treatment as Button's "secondary" variant active state: a border
// that's already reserved (transparent) so it doesn't shift the text when
// it turns black on selection.
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
  return (
    <div>
      <div
        className={`h-12.5 flex justify-center items-center border-b border-primary-00${
          borderTop ? " border-t" : ""
        }`}
      >
        <p className="hl-xs uppercase">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-primary-01">
        {items.map((item, index) => {
          const value = getValue(item);
          const isSelected = selected.includes(value);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onToggle(value)}
              aria-pressed={isSelected}
              className="h-12.5 flex w-full items-center px-7.5 text-left cursor-pointer bg-primary-03"
            >
              {renderItem(item, isSelected)}
            </button>
          );
        })}
        <GridFillers items={items} cols={2} />
      </div>
    </div>
  );
}

const FiltersPanel = ({ isOpen, onApply, onClear }) => {
  const [draft, setDraft] = useState(emptySelection);

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
      className="absolute w-160 bg-primary-03 h-[calc(100dvh-7.625rem)] border-r border-primary-00 flex flex-col justify-between"
    >
      <div className="border-b border-primary-00">
        <FilterSection
          title="Color"
          items={colors}
          getValue={(item) => item.label}
          selected={draft.color}
          onToggle={(value) => toggle("color", value)}
          renderItem={({ label, hex }, isSelected) => (
            <div className="flex w-full items-center justify-between">
              <p className={`by-sm ${wordSelectClass(isSelected)}`}>{label}</p>
              <div
                className="w-5.5 h-5.5 rounded-full"
                style={{ backgroundColor: hex }}
              ></div>
            </div>
          )}
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
      <div className="w-full h-18 border-t border-primary-00 flex">
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
