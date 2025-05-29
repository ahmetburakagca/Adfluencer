import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  shadow?: boolean;
}

export const Card = ({
  children,
  padding = "md",
  border = true,
  shadow = true,
  className = "",
  ...props
}: CardProps) => {
  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const borderStyles = border ? "border border-gray-200" : "";
  const shadowStyles = shadow ? "shadow-md" : "";

  return (
    <div
      className={`bg-white rounded-lg ${paddingStyles[padding]} ${borderStyles} ${shadowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardBody = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
