import React from "react";

type VariantPrimaryWrapperProps = {
  className?: string;
  label: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const VariantPrimaryWrapper: React.FC<VariantPrimaryWrapperProps> = ({
  className = "",
  label,
  size = "medium",
  variant = "primary",
  onClick,
}) => {
  return (
    <button
      className={`btn ${className} btn-${size} btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
