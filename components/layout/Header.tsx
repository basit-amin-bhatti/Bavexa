"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Menu, Mic, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CalBookingButton } from "@/components/CalBookingButton";
import { siteConfig } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuPortalReady, setMenuPortalReady] = useState(false);
  const isDemo = usePathname() === "/demo";

  useEffect(() => {
    const updateHeaderState = () => setScrolled(window.scrollY > 24);

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousPageOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousPageOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  // Keep the demo menu outside the header's backdrop-filter containing block.
  // The first menu interaction enables the portal without changing server HTML.
  const mobileNavigation = (
    <>
      <button
        className={`mobile-nav-backdrop ${isDemo ? "demo-nav-backdrop" : ""} ${open ? "mobile-nav-backdrop-open" : ""}`}
        type="button"
        aria-label="Close navigation"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />

      <div id="mobile-navigation" className={`mobile-nav ${isDemo ? "demo-mobile-nav" : ""} ${isDemo && scrolled ? "demo-mobile-nav-scrolled" : ""} ${open ? "mobile-nav-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          {siteConfig.nav.map((item) => {
            const isLiveAiDemo = item.href === "/demo";

            return (
              <Link
                key={item.href}
                className={isLiveAiDemo ? "nav-live-demo" : undefined}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {isLiveAiDemo ? <Mic aria-hidden="true" /> : null}
                {isLiveAiDemo ? "Live AI Demo" : item.label}
              </Link>
            );
          })}
          <CalBookingButton className="button button-primary" onBeforeOpen={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );

  return (
    <>
    {isDemo && open ? <div className="demo-header-spacer" aria-hidden="true" /> : null}
    <header className={`site-header ${scrolled ? "site-header-scrolled" : ""} ${isDemo && open ? "demo-menu-open" : ""}`}>
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
          {siteConfig.nav.map((item) => {
            const isLiveAiDemo = item.href === "/demo";

            return (
              <Link
                key={item.href}
                className={isLiveAiDemo ? "nav-live-demo" : undefined}
                href={item.href}
              >
                {isLiveAiDemo ? <Mic aria-hidden="true" /> : null}
                {isLiveAiDemo ? "Live AI Demo" : item.label}
              </Link>
            );
          })}
        </nav>

        <CalBookingButton className="nav-cta" arrow="external" />

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => {
            setMenuPortalReady(true);
            setOpen((value) => !value);
          }}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isDemo ? (menuPortalReady ? createPortal(mobileNavigation, document.body) : null) : mobileNavigation}
    </header>
    </>
  );
}
