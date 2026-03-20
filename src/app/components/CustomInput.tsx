import React from "react";

interface CustomInputProps {
  label?: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  fullWidth = true,
  autoComplete,
  inputMode,
  pattern,
}) => {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 px-6 py-3 text-sm font-medium text-slate-100 transition-all duration-300 placeholder-slate-400 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      />
    </div>
  );
};

export default CustomInput;
