import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
  showArrow?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = true,
}: ButtonProps) {
  return (
    <Link className={`button button-${variant} ${className}`} href={href}>
      <span>{children}</span>
      {showArrow ? <ArrowRight aria-hidden="true" size={17} strokeWidth={2} /> : null}
    </Link>
  );
}
