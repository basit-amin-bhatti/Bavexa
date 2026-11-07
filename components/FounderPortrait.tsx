"use client";

import { useState } from "react";

type FounderPortraitProps = {
  profile: {
    image: string;
    imageEnabled: boolean;
    initials: string;
    name: string;
    role: string;
  };
};

export function FounderPortrait({ profile }: FounderPortraitProps) {
  const [missing, setMissing] = useState(false);

  return (
    <div className="founder-portrait">
      {profile.imageEnabled && !missing ? (
        // A standard img lets the founder portrait be replaced by dropping in one file.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.image} alt={`Portrait of ${profile.name}, ${profile.role}`} onError={() => setMissing(true)} />
      ) : (
        <div className="founder-placeholder" role="img" aria-label={`Portrait placeholder for ${profile.name}`}>
          <span>{profile.initials}</span>
          <small>{profile.role}</small>
        </div>
      )}
    </div>
  );
}
