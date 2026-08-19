"use client";

import { ArrowRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import { siteConfig } from "@/content/site";

const CAL_LINK = "basitaminbhatti/roofing-growth-call";
const CAL_NAMESPACE = "roofing-growth-call";

type CalBookingButtonProps = {
  arrow?: "right" | "external";
  className?: string;
  onBeforeOpen?: () => void;
};

export function CalBookingButton({
  arrow = "right",
  className,
  onBeforeOpen,
}: CalBookingButtonProps = {}) {
  const calApiPromise = useRef<ReturnType<typeof getCalApi> | null>(null);
  const [opening, setOpening] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const prepareBooking = useCallback(() => {
    if (!calApiPromise.current) {
      calApiPromise.current = getCalApi({ namespace: CAL_NAMESPACE }).then((cal) => {
        cal("ui", {
          theme: "light",
          hideEventTypeDetails: false,
          layout: "month_view",
          styles: { branding: { brandColor: "#1f71ff" } },
        });
        cal("preload", { calLink: CAL_LINK, type: "modal" });
        return cal;
      });
    }

    return calApiPromise.current;
  }, []);

  const warmBooking = () => {
    void prepareBooking().catch(() => {
      calApiPromise.current = null;
    });
  };

  const openBooking = async () => {
    onBeforeOpen?.();
    setOpening(true);
    setLoadError(false);

    try {
      const cal = await prepareBooking();
      cal("modal", {
        calLink: CAL_LINK,
        config: { layout: "month_view" },
      });
    } catch {
      calApiPromise.current = null;
      setLoadError(true);
    } finally {
      setOpening(false);
    }
  };

  return (
    <>
      <button
        className={className}
        type="button"
        aria-haspopup="dialog"
        aria-busy={opening}
        disabled={opening}
        onClick={openBooking}
        onPointerEnter={warmBooking}
        onFocus={warmBooking}
      >
        <span>{opening ? "OPENING BOOKING CALENDAR…" : siteConfig.ctas.primary}</span>
        {arrow === "external" ? <span aria-hidden="true">↗</span> : <ArrowRight size={18} aria-hidden="true" />}
      </button>
      {loadError ? <span className="cal-booking-status" role="alert">The booking calendar could not load. Please try again.</span> : null}
    </>
  );
}
