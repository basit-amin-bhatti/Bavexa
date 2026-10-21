import Image from "next/image";
import { ExternalLink, Mail } from "lucide-react";
import { contactChannels } from "@/content/contact";
import styles from "./ContactChannels.module.css";

export function ContactEmailLink({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`${styles.email} ${footer ? styles.footerEmail : ""}`} href={`mailto:${contactChannels.email}`}>
      <Mail size={17} aria-hidden="true" /><span>{contactChannels.email}</span>
    </a>
  );
}

export function OtherWaysToConnect() {
  return (
    <aside className={styles.connections} aria-labelledby="contact-channels-title">
      <h3 id="contact-channels-title">Other Ways to Connect</h3>
      <a className={styles.whatsapp} href={contactChannels.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp (opens in a new tab)">
        <Image src="/assets/whatsapp.svg" width={20} height={20} alt="" unoptimized />
        <span>Chat on WhatsApp</span><ExternalLink size={14} aria-hidden="true" />
      </a>
      <ContactEmailLink />
    </aside>
  );
}
