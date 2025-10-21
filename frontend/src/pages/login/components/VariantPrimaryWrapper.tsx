import React from "react";

type VariantPrimaryWrapperProps = {
  className?: string;
  label: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean; // disabled 속성 추가
};

export const VariantPrimaryWrapper: React.FC<VariantPrimaryWrapperProps> = ({
  className = "",
  label,
  size = "medium",
  variant = "primary",
  onClick,
  disabled = false, // disabled 기본값 false로 설정
}) => {
  return (
    <button
      className={`btn ${className} btn-${size} btn-${variant}`}
      onClick={onClick}
      disabled={disabled} // disabled 처리
    >
      {label}
    </button>
  );
};
