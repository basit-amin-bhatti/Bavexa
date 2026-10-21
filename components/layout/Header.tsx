"use client";

import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Menu, Mic, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalBookingButton } from "@/components/CalBookingButton";
import { siteConfig } from "@/content/site";
import { createMobileNavigationHistory } from "@/lib/mobile-navigation";

const headerNav = siteConfig.nav.map((item) => item.href === "/#founder" ? { label: "Contact", href: "/contact" } : item);

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuPortalReady, setMenuPortalReady] = useState(false);
  const menuHistory = useRef<ReturnType<typeof createMobileNavigationHistory> | null>(null);
  const scrollLocked = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    menuHistory.current?.close();
    setOpen(false);
  }, []);

  const closeForNavigation = () => {
    menuHistory.current?.prepareNavigation();
    setOpen(false);
  };

  useEffect(() => {
    const controller = createMobileNavigationHistory(window.history, () => setOpen(false));
    menuHistory.current = controller;
    window.addEventListener("popstate", controller.handlePopState);
    return () => {
      controller.prepareNavigation();
      window.removeEventListener("popstate", controller.handlePopState);
      menuHistory.current = null;
    };
  }, []);

  useEffect(() => {
    const updateHeaderState = () => {
      if (!scrollLocked.current) setScrolled(window.scrollY > 24);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const page = document.documentElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const previousBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
    };
    const previousPageOverflow = page.style.overflow;
    const previousGutter = page.style.scrollbarGutter;
    const previousFocus = document.activeElement as HTMLElement | null;
    const background = [...document.querySelectorAll<HTMLElement>("#main-content, footer, .skip-link")];
    const previousInert = background.map((element) => element.inert);
    const navigation = document.getElementById("mobile-navigation");

    scrollLocked.current = true;
    page.style.scrollbarGutter = "stable";
    page.style.overflow = "hidden";
    Object.assign(body.style, {
      overflow: "hidden", position: "fixed", top: `-${scrollY}px`, left: `-${scrollX}px`, width: "100%",
    });
    background.forEach((element) => { element.inert = true; });
    const focusFrame = requestAnimationFrame(() => navigation?.querySelector("a")?.focus({ preventScroll: true }));

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
      if (event.key !== "Tab") return;
      const controls = [toggleRef.current, ...navigation?.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)") ?? []].filter((element): element is HTMLElement => Boolean(element));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyboard);

    return () => {
      cancelAnimationFrame(focusFrame);
      Object.assign(body.style, previousBody);
      page.style.overflow = previousPageOverflow;
      page.style.scrollbarGutter = previousGutter;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      scrollLocked.current = false;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, [closeMenu]);

  // Keep mobile overlays outside the header's backdrop-filter containing block.
  // The first menu interaction enables the portal without changing server HTML.
  const mobileNavigation = (
    <>
      <button
        className={`mobile-nav-backdrop ${open ? "mobile-nav-backdrop-open" : ""}`}
        type="button"
        aria-label="Close navigation backdrop"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={closeMenu}
      />

      <div id="mobile-navigation" className={`mobile-nav ${scrolled ? "mobile-nav-scrolled" : ""} ${open ? "mobile-nav-open" : ""}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile navigation">
          <Link href="/" replace onNavigate={closeForNavigation}>Home</Link>
          {headerNav.map((item) => {
            const isLiveAiDemo = item.href === "/demo";

            return (
              <Link
                key={item.href}
                className={isLiveAiDemo ? "nav-live-demo" : undefined}
                href={item.href}
                replace
                onNavigate={closeForNavigation}
              >
                {isLiveAiDemo ? <Mic aria-hidden="true" /> : null}
                {isLiveAiDemo ? "Live AI Demo" : item.label}
              </Link>
            );
          })}
          <CalBookingButton className="button button-primary" onBeforeOpen={closeMenu} />
        </nav>
      </div>
    </>
  );

  return (
    <>
    {open ? <div className="mobile-header-spacer" aria-hidden="true" /> : null}
    <header className={`site-header ${scrolled ? "site-header-scrolled" : ""} ${open ? "mobile-menu-open" : ""}`}>
      <div className="container nav-shell">
        <Link className="brand" href="/" aria-label="BAVEXA home" replace={open} onNavigate={closeForNavigation}>
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
          {headerNav.map((item) => {
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
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => {
            if (open) {
              closeMenu();
              return;
            }
            setMenuPortalReady(true);
            menuHistory.current?.open(window.location.href);
            setOpen(true);
          }}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

    </header>
    {menuPortalReady ? createPortal(mobileNavigation, document.body) : null}
    </>
  );
}
