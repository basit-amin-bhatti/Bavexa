import { CircleCheck } from "lucide-react";
import { siteConfig } from "@/content/site";
import { formatUsd } from "@/lib/pricing";
import styles from "./SetupOffer.module.css";

export function SetupOffer({ compact = false }: { compact?: boolean }) {
  const pricing = siteConfig.pricing;
  if (!pricing.launchOffer.enabled) return <span>{formatUsd(pricing.setupFee)} one-time setup fee</span>;

  return (
    <span className={`${styles.offer} ${compact ? styles.compact : ""}`}>
      <span className={styles.original}><span className={styles.srOnly}>Original setup fee: </span><s>{formatUsd(pricing.setupFee)} one-time setup fee</s></span>
      <span className={styles.waived}><CircleCheck size={16} aria-hidden="true" /><span>{pricing.launchOffer.setupLabel}</span></span>
      {compact ? <span className={styles.context}>For Starter launch customers</span> : null}
    </span>
  );
}
