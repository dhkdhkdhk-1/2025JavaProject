import React from "react";

type CheckboxFieldProps = {
  className?: string;
  label: string;
  valueType?: "checked" | "unchecked";
  state?: "default" | "disabled";
  description?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  className = "",
  label,
  valueType = "unchecked",
  state = "default",
  description,
  onChange,
}) => {
  return (
    <label className={`checkbox-field ${className}`}>
      <input
        type="checkbox"
        defaultChecked={valueType === "checked"}
        disabled={state === "disabled"}
        style={{ marginRight: "8px" }}
        onChange={onChange}
      />
      {label}
      {description && <div className="checkbox-desc">{description}</div>}
    </label>
  );
};
