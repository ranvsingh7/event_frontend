import React from "react";

interface CustomSelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  fullWidth = true,
}) => {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-full border border-cyan-500/40 bg-slate-900/60 px-6 py-3 pr-12 text-sm font-medium text-slate-100 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300">
          ▼
        </span>
      </div>
    </div>
  );
};

export default CustomSelect;
