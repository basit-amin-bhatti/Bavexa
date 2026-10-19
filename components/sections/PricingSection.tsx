import { Check, Clock3, Info } from "lucide-react";
import { CalBookingButton } from "@/components/CalBookingButton";
import { SetupOffer } from "@/components/SetupOffer";
import { siteConfig } from "@/content/site";
import { formatUsd, getUsageDisclosure } from "@/lib/pricing";
import styles from "./PricingSection.module.css";

export function PricingSection() {
  const pricing = siteConfig.pricing;
  if (!pricing.enabled) return null;

  return (
    <section className={styles.section} id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <div className={styles.heading}>
          <p className="eyebrow">ONE FOCUSED PLAN</p>
          <h2 id="pricing-title">Simple Pricing. Built for Growing Roofing Companies.</h2>
        </div>
        <article className={styles.card} aria-labelledby="starter-plan-title">
          <div className={styles.summary}>
            <div className={styles.planHeading}>
              <h3 id="starter-plan-title">{pricing.planName}</h3>
              {pricing.launchOffer.enabled ? <span className={styles.launchBadge}>{pricing.launchOffer.badge}</span> : null}
            </div>
            <p className={styles.starting}>Starting at</p>
            <p className={styles.price}>
              <strong>{formatUsd(pricing.startingMonthly)}</strong>
              <span>/month</span><small>{pricing.currency}</small>
            </p>
            <div className={styles.setup}><SetupOffer /></div>
            <div className={styles.implementation}>
              <Clock3 size={17} aria-hidden="true" />
              <div><span>Target Implementation:</span><strong>{pricing.implementationDays.minimum}–{pricing.implementationDays.maximum} Business Days.</strong></div>
            </div>
          </div>
          <div className={styles.included}>
            <p className={styles.includedLabel}>INCLUDED IN STARTER</p>
            <ul>{pricing.features.map((feature) => <li key={feature}><Check size={17} strokeWidth={2} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
            <p className={styles.custom}>{pricing.customPricing}</p>
          </div>
          <div className={styles.action}>
            <CalBookingButton label={pricing.cta} className={`button button-primary ${styles.booking}`} />
            <p className={styles.reassurance}>Free strategy call · No obligation</p>
          </div>
          <div className={styles.usage}>
            <Info size={17} aria-hidden="true" />
            <p>{getUsageDisclosure(pricing)}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
