import React from "react";

type TextContentTitleProps = {
  className?: string;
  divClassName?: string;
  divClassNameOverride?: string;
  title: string;
  align?: "center" | "left" | "right";
};

export const TextContentTitle: React.FC<TextContentTitleProps> = ({
  className = "",
  divClassName = "",
  divClassNameOverride = "",
  title,
  align = "center",
}) => {
  return (
    <div
      className={`text-content-title ${className}`}
      style={{ textAlign: align }}
    >
      <div className={`${divClassName} ${divClassNameOverride}`}>
        <h1>{title}</h1>
      </div>
    </div>
  );
};
