import Link from "next/link";
import { siteConfig } from "@/content/site";

const footerLinks = [
  { label: "Home", href: "/" },
  ...siteConfig.nav,
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" href="/" aria-label="BAVEXA home">
            <span className="brand-mark" aria-hidden="true">B</span>
            <span className="brand-name">BAVEXA</span>
          </Link>
          <p className="footer-positioning">{siteConfig.brand.positioning}</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <div className="founder-credit">
          <p>Founded by <a href={siteConfig.founder.website} target="_blank" rel="noreferrer">{siteConfig.founder.name}</a></p>
          <span>{siteConfig.founder.positioning}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BAVEXA. All rights reserved.</span>
        <span>Built for roofing companies.</span>
      </div>
    </footer>
  );
}
