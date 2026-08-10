"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="brand" href="/" aria-label="BAVEXA home" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">B</span>
          <span className="brand-name">BAVEXA</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <Link className="nav-cta" href={siteConfig.ctas.primaryHref}>
          {siteConfig.ctas.primaryShort}
          <span aria-hidden="true">↗</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div id="mobile-navigation" className={`mobile-nav ${open ? "mobile-nav-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <Link className="button button-primary" href={siteConfig.ctas.primaryHref} onClick={() => setOpen(false)}>
            <span>{siteConfig.ctas.primary}</span><span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
