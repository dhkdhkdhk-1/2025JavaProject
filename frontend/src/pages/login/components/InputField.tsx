import React, { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  value: string;
  valueType: "value" | "checked";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  type?: string;
  placeholder?: string; // ✅ 추가
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  valueType,
  onChange,
  className,
  inputClassName,
  type = "text",
  placeholder, // ✅ 구조 분해 추가
}) => {
  return (
    <div className={className || "signup-input"}>
      {/* label과 input을 세로 정렬 */}
      <label className="signup-label">{label}</label>
      <input
        className={inputClassName || "signup-input-field"}
        type={type}
        value={valueType === "value" ? value : undefined}
        checked={valueType === "checked" ? value === "true" : undefined}
        onChange={onChange}
        placeholder={placeholder} // ✅ 적용됨
      />
    </div>
  );
};
