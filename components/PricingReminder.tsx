import { siteConfig } from "@/content/site";
import { formatUsd } from "@/lib/pricing";
import { SetupOffer } from "./SetupOffer";
import styles from "./PricingReminder.module.css";

export function PricingReminder({ placement }: { placement: "hero" | "demo" | "postCall" }) {
  const pricing = siteConfig.pricing;
  if (!pricing.enabled) return null;
  const monthlyPrice = `${formatUsd(pricing.startingMonthly)}/month`;

  if (placement === "hero") {
    return <a href="#pricing" className={styles.hero}><span>Plans starting at <strong>{monthlyPrice}</strong></span><SetupOffer compact /></a>;
  }

  return (
    <p className={styles[placement]}>
      {placement === "postCall" ? "Get Your Own AI Receptionist — Starting at " : "Plans starting at "}
      <strong>{monthlyPrice}</strong>
      <span className={styles.setup}><SetupOffer compact /></span>
    </p>
  );
}
