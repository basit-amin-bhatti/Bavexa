import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { contactChannels } from "../content/contact";

test("contact channels use the approved direct WhatsApp URL and email", () => {
  assert.equal(contactChannels.whatsappUrl, "https://wa.me/923228417879");
  assert.equal(contactChannels.email, "hello@basitaminbhatti.me");
});

test("WhatsApp opens safely in a new tab and its number is never used as visible text", () => {
  const component = readFileSync(new URL("../components/ContactChannels.tsx", import.meta.url), "utf8");
  assert.match(component, /href=\{contactChannels.whatsappUrl\} target="_blank" rel="noopener noreferrer"/);
  assert.equal(component.match(/contactChannels.whatsappUrl/g)?.length, 1);
  assert.doesNotMatch(component, /923228417879|0322|tel:/);
  assert.match(component, /<span>Chat on WhatsApp<\/span>/);
  assert.match(component, /href=\{`mailto:\$\{contactChannels.email\}`\}/);
});

test("the global footer reuses the contact email and mobile connections follow the form", () => {
  const footer = readFileSync(new URL("../components/layout/Footer.tsx", import.meta.url), "utf8");
  assert.match(footer, /<ContactEmailLink footer\s*\/>/);
  const css = readFileSync(new URL("../components/ContactChannels.module.css", import.meta.url), "utf8");
  assert.match(css, /grid-template-areas: "intro form" "benefits connect"/);
  assert.match(css, /@media \(max-width: 900px\).*"form" "connect"/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("email is a native mailto anchor covering its icon and text with no interception", () => {
  const component = readFileSync(new URL("../components/ContactChannels.tsx", import.meta.url), "utf8");
  const emailLink = component.split("export function ContactEmailLink")[1].split("export function OtherWaysToConnect")[0];
  assert.match(emailLink, /<a\b[^>]*href=\{`mailto:\$\{contactChannels.email\}`\}>\s*<Mail[^>]*\/><span>\{contactChannels.email\}<\/span>\s*<\/a>/);
  assert.doesNotMatch(emailLink, /onClick|preventDefault|window\.location|javascript:|\?subject=|\?body=/);
  const css = readFileSync(new URL("../components/ContactChannels.module.css", import.meta.url), "utf8");
  const emailRule = css.match(/\.email \{([^}]+)\}/)?.[1] || "";
  assert.match(emailRule, /width: 100%/);
  assert.match(emailRule, /min-height: 44px/);
  assert.match(emailRule, /cursor: pointer/);
});
