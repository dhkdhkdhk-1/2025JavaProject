import React from "react";

type InputFieldProps = {
  className?: string;
  inputClassName?: string;
  label: string;
  value?: string;
  valueType?: "placeholder" | "value";
  state?: "default" | "disabled";
  type?: string; // ✅ 비밀번호 등 input type 지정용 속성 추가
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputField: React.FC<InputFieldProps> = ({
  className = "",
  inputClassName = "",
  label,
  value = "",
  valueType = "placeholder",
  state = "default",
  type = "text", // ✅ 기본값은 text로 설정
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
        type={type} // ✅ type prop을 적용
        className={inputClassName}
        placeholder={valueType === "placeholder" ? value : ""}
        value={valueType === "value" ? value : undefined}
        disabled={state === "disabled"}
        onChange={onChange}
      />
    </div>
  );
};
