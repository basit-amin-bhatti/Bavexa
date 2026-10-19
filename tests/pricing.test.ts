import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteConfig } from "../content/site";
import { formatUsd, getUsageDisclosure } from "../lib/pricing";

test("Starter uses the requested USD offer without inventing usage limits or a trial", () => {
  const pricing = siteConfig.pricing;
  assert.equal(pricing.enabled, true);
  assert.equal(pricing.planName, "BAVEXA Starter");
  assert.equal(pricing.currency, "USD");
  assert.equal(pricing.startingMonthly, 399);
  assert.equal(pricing.setupFee, 299);
  assert.equal(pricing.launchOffer.enabled, true);
  assert.equal(pricing.launchOffer.setupLabel, "Setup Fee Waived — FREE");
  assert.deepEqual(pricing.implementationDays, { minimum: 3, maximum: 7 });
  assert.equal(pricing.features.length, 6);
  assert.equal(pricing.includedCallMinutes, null);
  assert.equal(pricing.overagePerMinute, null);
  assert.equal("trialDays" in pricing, false);
});

test("pricing is formatted for US owners without unnecessary decimal places", () => {
  assert.equal(formatUsd(siteConfig.pricing.startingMonthly), "$399");
  assert.equal(formatUsd(siteConfig.pricing.setupFee), "$299");
  assert.equal(formatUsd(0.125), "$0.125");
});

test("usage disclosure keeps allowances and extra charges proposal-dependent", () => {
  assert.equal(getUsageDisclosure(siteConfig.pricing), "Monthly call allowance and any additional usage charges are confirmed in your proposal before you commit.");
  assert.match(getUsageDisclosure({ includedCallMinutes: 500, overagePerMinute: null }), /Includes 500 call minutes per month\. Any overage rates will be confirmed/);
  assert.match(getUsageDisclosure({ includedCallMinutes: null, overagePerMinute: 0.25 }), /Included call minutes will be confirmed.*\$0\.25\/minute/);
  assert.equal(getUsageDisclosure({ includedCallMinutes: 1000, overagePerMinute: 0.25 }), "Includes 1,000 call minutes per month. Additional minutes: $0.25/minute.");
});

test("all pricing surfaces use the shared setup waiver without an initial-payment claim", () => {
  for (const path of ["components/sections/PricingSection.tsx", "components/PricingReminder.tsx"]) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.match(source, /<SetupOffer\b/);
    assert.doesNotMatch(source, /paymentSummary|initialPayment|to get started|Limited Launch Offer/);
  }
  const setup = readFileSync(new URL("../components/SetupOffer.tsx", import.meta.url), "utf8");
  assert.match(setup, /<s>\{formatUsd\(pricing.setupFee\)\} one-time setup fee<\/s>/);
  assert.match(setup, /pricing.launchOffer.setupLabel/);
  assert.match(setup, /For Starter launch customers/);
});

test("the pricing card presents setup, target implementation and features before booking", () => {
  const source = readFileSync(new URL("../components/sections/PricingSection.tsx", import.meta.url), "utf8");
  const order = ["starter-plan-title\">", "styles.starting", "<SetupOffer", "Target Implementation:", "pricing.features.map", "<CalBookingButton", "getUsageDisclosure(pricing)"];
  const positions = order.map((token) => source.indexOf(token));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("the single pricing section sits between Integrations and the founder call section", () => {
  const source = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.equal(source.match(/<PricingSection\s*\/>/g)?.length, 1);
  assert.ok(source.indexOf("<IntegrationsSection />") < source.indexOf("<PricingSection />"));
  assert.ok(source.indexOf("<PricingSection />") < source.indexOf("<FounderContactSection />"));
});
