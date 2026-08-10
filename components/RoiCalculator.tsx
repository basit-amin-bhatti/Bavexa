"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { calculateLeadOpportunity } from "@/lib/roi";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

type SliderFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  onChange: (value: number) => void;
};

function SliderField({ id, label, value, min, max, step, suffix = "", prefix = "", onChange }: SliderFieldProps) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className="calculator-field">
      <div className="field-heading">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{prefix}{value.toLocaleString("en-US")}{suffix}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--slider-fill": `${fill}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="range-labels" aria-hidden="true"><span>{prefix}{min}{suffix}</span><span>{prefix}{max.toLocaleString("en-US")}{suffix}</span></div>
    </div>
  );
}

export function RoiCalculator() {
  const reduceMotion = useReducedMotion();
  const [monthlyLeads, setMonthlyLeads] = useState(120);
  const [missedPercentage, setMissedPercentage] = useState(28);
  const [averageJobValue, setAverageJobValue] = useState(12500);
  const [closeRate, setCloseRate] = useState(25);
  const [recoverablePercentage, setRecoverablePercentage] = useState(35);

  const result = useMemo(() => calculateLeadOpportunity({
    monthlyLeads,
    missedPercentage,
    averageJobValue,
    closeRate,
    recoverablePercentage,
  }), [monthlyLeads, missedPercentage, averageJobValue, closeRate, recoverablePercentage]);

  return (
    <div className="calculator-shell">
      <div className="calculator-controls">
        <div className="calculator-kicker"><span>Use your numbers</span><i>USD</i></div>
        <SliderField id="monthly-leads" label="Monthly inbound leads" value={monthlyLeads} min={10} max={500} step={5} onChange={setMonthlyLeads} />
        <SliderField id="missed-percentage" label="Missed, delayed, or going cold" value={missedPercentage} min={0} max={80} step={1} suffix="%" onChange={setMissedPercentage} />
        <SliderField id="job-value" label="Average won roofing job value" value={averageJobValue} min={1000} max={50000} step={500} prefix="$" onChange={setAverageJobValue} />
        <SliderField id="close-rate" label="Close rate on qualified opportunities" value={closeRate} min={0} max={75} step={1} suffix="%" onChange={setCloseRate} />
        <SliderField id="recoverable" label="Missed opportunities potentially re-engaged" value={recoverablePercentage} min={0} max={80} step={1} suffix="%" onChange={setRecoverablePercentage} />
      </div>

      <div className="calculator-results" aria-live="polite">
        <span className="results-eyebrow">POTENTIAL MONTHLY REVENUE OPPORTUNITY</span>
        <motion.strong
          key={Math.round(result.potentialRevenueOpportunity)}
          initial={reduceMotion ? false : { opacity: 0.55, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="revenue-result"
        >
          {currency.format(result.potentialRevenueOpportunity)}
        </motion.strong>
        <p>Revenue represented by potentially recoverable opportunities—not a forecast or guarantee.</p>
        <div className="metric-grid">
          <div><span>Leads at risk</span><strong>{compactNumber.format(result.atRiskLeads)}</strong></div>
          <div><span>Potentially re-engaged</span><strong>{compactNumber.format(result.potentiallyRecoveredLeads)}</strong></div>
          <div><span>Potential jobs represented</span><strong>{compactNumber.format(result.potentialJobs)}</strong></div>
        </div>
        <div className="result-logic">
          <span>YOUR ASSUMPTIONS</span>
          <p>{monthlyLeads} leads × {missedPercentage}% at risk × {recoverablePercentage}% re-engaged × {closeRate}% close rate × {currency.format(averageJobValue)}</p>
        </div>
      </div>

      <p className="calculator-disclaimer">
        Illustrative estimate only. Results depend on your lead volume, qualification criteria, market, sales process, close rate and implementation. BAVEXA does not guarantee revenue or conversion outcomes.
      </p>
    </div>
  );
}
