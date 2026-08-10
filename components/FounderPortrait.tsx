"use client";

import { useState } from "react";
import { siteConfig } from "@/content/site";

export function FounderPortrait() {
  const [missing, setMissing] = useState(false);

  return (
    <div className="founder-portrait">
      {siteConfig.founder.imageEnabled && !missing ? (
        // A standard img lets the founder portrait be replaced by dropping in one file.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={siteConfig.founder.image} alt={`Portrait of ${siteConfig.founder.name}, founder of BAVEXA`} onError={() => setMissing(true)} />
      ) : (
        <div className="founder-placeholder" role="img" aria-label={`Portrait placeholder for ${siteConfig.founder.name}`}>
          <span>BAB</span>
          <small>Founder portrait</small>
        </div>
      )}
    </div>
  );
}
