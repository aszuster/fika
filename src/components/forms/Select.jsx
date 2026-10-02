"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import Chevron from "@/svg/Chevron";

const Select = ({ value, onChange, options, placeholder = "", className = "" }) => (
  <Listbox value={value} onChange={onChange}>
    <ListboxButton
      className={`group flex w-full items-center justify-between gap-4 text-left cursor-pointer outline-none ${className}`}
    >
      <span className={`truncate ${value ? "" : "text-secondary-02"}`}>
        {value || placeholder}
      </span>
      <span className="shrink-0 rotate-90 transition-transform duration-200 group-data-open:-rotate-90">
        <Chevron />
      </span>
    </ListboxButton>
    <ListboxOptions
      anchor="bottom"
      transition
      className="z-50 w-(--button-width) bg-primary-03 border border-primary-00 shadow-[0_4px_12px_rgba(0,0,0,0.15)] outline-none transition duration-150 ease-out data-closed:opacity-0"
    >
      {options.map((option) => (
        <ListboxOption
          key={option}
          value={option}
          className="by-sm py-2.5 px-4 text-secondary-02 cursor-pointer data-selected:text-primary-00 data-focus:bg-primary-00 data-focus:text-secondary-02"
        >
          {option}
        </ListboxOption>
      ))}
    </ListboxOptions>
  </Listbox>
);

export default Select;
