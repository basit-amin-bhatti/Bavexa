"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./IntegrationShowcase.module.css";

const brands = [
  ["ElevenLabs", "elevenlabs"],
  ["OpenAI", "openai"],
  ["Twilio", "twilio"],
  ["n8n", "n8n"],
  ["Zapier", "zapier"],
  ["Make", "make"],
  ["GoHighLevel", "gohighlevel"],
  ["HubSpot", "hubspot"],
  ["Google Calendar", "google-calendar"],
  ["Cal.com", "cal-com"],
  ["Gmail", "gmail"],
  ["Google Sheets", "google-sheets"],
  ["Slack", "slack"],
  ["Supabase", "supabase"],
  ["Next.js", "nextjs"],
  ["Vercel", "vercel"],
  ["GitHub", "github"],
  ["Claude Code", "claude-code"],
] as const;

type Point = { x: number; y: number };
type Badge = Point & {
  element: HTMLElement;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  radius: number;
};

function confine(badge: Badge, width: number, height: number) {
  const inset = badge.radius + 12;
  if (badge.x < inset || badge.x > width - inset) {
    badge.x = Math.max(inset, Math.min(width - inset, badge.x));
    badge.vx *= -0.32;
  }
  if (badge.y < inset || badge.y > height - inset) {
    badge.y = Math.max(inset, Math.min(height - inset, badge.y));
    badge.vy *= -0.32;
  }
}

function collide(first: Badge, second: Badge) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const minimum = first.radius + second.radius + 5;
  const squaredDistance = dx * dx + dy * dy;
  if (squaredDistance >= minimum * minimum) return;

  const distance = Math.sqrt(squaredDistance);
  const nx = distance > 0 ? dx / distance : 1;
  const ny = distance > 0 ? dy / distance : 0;
  const correction = (minimum - distance) / 2;
  first.x -= nx * correction;
  first.y -= ny * correction;
  second.x += nx * correction;
  second.y += ny * correction;

  const closingSpeed = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
  if (closingSpeed >= 0) return;

  const impulse = -0.65 * closingSpeed;
  first.vx -= nx * impulse;
  first.vy -= ny * impulse;
  second.vx += nx * impulse;
  second.vy += ny * impulse;
}

export function IntegrationShowcase() {
  const fieldRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const elements = Array.from(field.querySelectorAll("li"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    let badges: Badge[] = [];
    let pointer: Point | null = null;
    let width = 0;
    let height = 0;
    let visible = false;
    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;

    function animate(time: number) {
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 1 / 30) : 0;
      previousTime = time;
      elapsed += dt;
      const drift = finePointer.matches ? 9 : 4;
      const damping = Math.exp(-7 * dt);

      for (const [index, badge] of badges.entries()) {
        const phase = index * 2.39996;
        let targetX = badge.homeX + Math.sin(elapsed * 0.78 + phase) * drift;
        let targetY = badge.homeY + Math.cos(elapsed * 0.92 + phase) * drift;

        if (pointer) {
          const dx = pointer.x - badge.homeX;
          const dy = pointer.y - badge.homeY;
          const distance = Math.hypot(dx, dy);
          const attraction = Math.max(0, 1 - distance / 172);
          const pull = Math.min(distance * 0.82, 74 * attraction);
          if (distance > 0) {
            targetX += (dx / distance) * pull;
            targetY += (dy / distance) * pull;
          }
        }

        badge.vx = (badge.vx + (targetX - badge.x) * 27 * dt) * damping;
        badge.vy = (badge.vy + (targetY - badge.y) * 27 * dt) * damping;
        badge.x += badge.vx * dt;
        badge.y += badge.vy * dt;
        confine(badge, width, height);
      }

      // Repeat contact resolution so a collision can pass through a cluster of badges.
      for (let pass = 0; pass < 4; pass++) {
        for (let first = 0; first < badges.length; first++) {
          for (let second = first + 1; second < badges.length; second++) {
            collide(badges[first], badges[second]);
          }
        }
        for (const badge of badges) confine(badge, width, height);
      }

      for (const badge of badges) {
        badge.element.style.transform = `translate3d(${badge.x - badge.homeX}px, ${badge.y - badge.homeY}px, 0)`;
      }
      frame = requestAnimationFrame(animate);
    }

    const syncAnimation = () => {
      if (visible && !document.hidden && !reducedMotion.matches) {
        if (!frame) {
          field.dataset.moving = "";
          frame = requestAnimationFrame(animate);
        }
        return;
      }

      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      pointer = null;
      delete field.dataset.moving;
      if (reducedMotion.matches) {
        for (const badge of badges) {
          badge.element.style.removeProperty("transform");
          badge.x = badge.homeX;
          badge.y = badge.homeY;
          badge.vx = 0;
          badge.vy = 0;
        }
      }
    };

    const measure = () => {
      width = field.clientWidth;
      height = field.clientHeight;
      badges = elements.map((element) => {
        const radius = element.offsetWidth / 2;
        const homeX = element.offsetLeft + radius;
        const homeY = element.offsetTop + radius;
        element.style.removeProperty("transform");
        return { element, radius, homeX, homeY, x: homeX, y: homeY, vx: 0, vy: 0 };
      });
      pointer = null;
    };

    const movePointer = (event: PointerEvent) => {
      if (!frame || event.pointerType === "touch" || !finePointer.matches) return;
      const rect = field.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left - field.clientLeft, y: event.clientY - rect.top - field.clientTop };
    };
    const clearPointer = () => { pointer = null; };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(field);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    intersectionObserver.observe(field);

    field.addEventListener("pointermove", movePointer);
    field.addEventListener("pointerleave", clearPointer);
    field.addEventListener("pointercancel", clearPointer);
    window.addEventListener("scroll", clearPointer, { passive: true });
    document.addEventListener("visibilitychange", syncAnimation);
    reducedMotion.addEventListener("change", syncAnimation);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      field.removeEventListener("pointermove", movePointer);
      field.removeEventListener("pointerleave", clearPointer);
      field.removeEventListener("pointercancel", clearPointer);
      window.removeEventListener("scroll", clearPointer);
      document.removeEventListener("visibilitychange", syncAnimation);
      reducedMotion.removeEventListener("change", syncAnimation);
      delete field.dataset.moving;
      for (const element of elements) element.style.removeProperty("transform");
    };
  }, []);

  return (
    <ul ref={fieldRef} className={styles.field} aria-label="Tools in the BAVEXA technology showcase">
      {brands.map(([name, slug]) => (
        <li className={styles.badge} data-brand={slug} key={slug}>
          <Image
            className={styles.logo}
            src={`/assets/integrations/${slug}.${slug === "gohighlevel" ? "png" : "svg"}`}
            alt={name}
            width={48}
            height={48}
            unoptimized
            draggable={false}
          />
        </li>
      ))}
    </ul>
  );
}
