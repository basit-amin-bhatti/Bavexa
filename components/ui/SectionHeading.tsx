import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  copy?: ReactNode;
  align?: "left" | "center";
  theme?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  theme = "light",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${align === "center" ? "heading-center" : ""} ${theme === "dark" ? "heading-dark" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {copy ? <div className="section-copy">{copy}</div> : null}
    </div>
  );
}
