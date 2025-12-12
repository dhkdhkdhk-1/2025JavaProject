import React, { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  value: string;
  valueType: "value" | "checked";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  inputId?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  valueType,
  onChange,
  className,
  inputClassName,
  type = "text",
  placeholder,
  autoComplete,
  name,
  inputId,
}) => {
  return (
    <div className={className || "signup-input"}>
      <label className="signup-label" htmlFor={inputId}>
        {label}
      </label>

      <input
        id={inputId}
        name={name}
        className={inputClassName || "signup-input-field"}
        type={type}
        value={valueType === "value" ? value : undefined}
        checked={valueType === "checked" ? value === "true" : undefined}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
};
