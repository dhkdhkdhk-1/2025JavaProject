import React from "react";

type InputFieldProps = {
  className?: string;
  inputClassName?: string;
  label: string;
  value?: string;
  valueType?: "placeholder" | "value";
  state?: "default" | "disabled";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputField: React.FC<InputFieldProps> = ({
  className = "",
  inputClassName = "",
  label,
  value = "",
  valueType = "placeholder",
  state = "default",
  onChange,
}) => {
  return (
    <div className={`input-field ${className}`}>
      <label
        style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}
      >
        {label}
      </label>
      <input
        type="text"
        className={inputClassName}
        placeholder={valueType === "placeholder" ? value : ""}
        value={valueType === "value" ? value : undefined}
        disabled={state === "disabled"}
        onChange={onChange}
      />
    </div>
  );
};
