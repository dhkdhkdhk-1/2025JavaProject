import React from "react";

type TextContentTitleProps = {
  className?: string;
  divClassName?: string;
  divClassNameOverride?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left" | "right";
};

export const TextContentTitle: React.FC<TextContentTitleProps> = ({
  className = "",
  divClassName = "",
  divClassNameOverride = "",
  title,
  subtitle,
  align = "center",
}) => {
  return (
    <div
      className={`text-content-title ${className}`}
      style={{ textAlign: align }}
    >
      <div className={`${divClassName} ${divClassNameOverride}`}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
};

export {};
