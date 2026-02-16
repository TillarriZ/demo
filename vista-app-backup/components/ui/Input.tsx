import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
    return (
      <label className="block" htmlFor={inputId}>
        {label ? (
          <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full border rounded-lg px-3 py-2 text-sm
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${error ? "border-[var(--risk-red)]" : "border-slate-300"}
            ${className}
          `}
          {...props}
        />
        {error ? (
          <span className="block text-sm text-[var(--risk-red)] mt-1">{error}</span>
        ) : null}
      </label>
    );
  }
);

Input.displayName = "Input";
export default Input;
