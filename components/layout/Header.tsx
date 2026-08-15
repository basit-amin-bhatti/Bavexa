"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderState = () => setScrolled(window.scrollY > 24);

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

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
    <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}>
      <div className="container nav-shell">
        <Link className="brand" href="/" aria-label="BAVEXA home" onClick={() => setOpen(false)}>
          <Image
            className="brand-logo"
            src="/assets/bavexa-logo.png"
            alt="BAVEXA"
            width={1021}
            height={124}
            priority
            unoptimized
          />
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
