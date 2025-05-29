import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = "", ...props }, ref) => {
    const inputStyles = `px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
      error ? "border-red-500" : "border-gray-300"
    }`;

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <div className={`${widthStyles} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${inputStyles} ${widthStyles}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
