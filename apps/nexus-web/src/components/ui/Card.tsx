import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  shadow = "md",
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
    >
      {children}
    </div>
  );
};
