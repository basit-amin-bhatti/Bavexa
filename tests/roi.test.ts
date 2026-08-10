import assert from "node:assert/strict";
import test from "node:test";
import { calculateLeadOpportunity } from "../lib/roi";

test("calculates lead and revenue opportunity from visible assumptions", () => {
  const result = calculateLeadOpportunity({
    monthlyLeads: 100,
    missedPercentage: 20,
    averageJobValue: 10000,
    closeRate: 25,
    recoverablePercentage: 40,
  });

  assert.deepEqual(result, {
    atRiskLeads: 20,
    potentiallyRecoveredLeads: 8,
    potentialJobs: 2,
    potentialRevenueOpportunity: 20000,
  });
});

test("clamps percentages and prevents negative business inputs", () => {
  const result = calculateLeadOpportunity({
    monthlyLeads: -20,
    missedPercentage: 140,
    averageJobValue: -5000,
    closeRate: -10,
    recoverablePercentage: 200,
  });

  assert.deepEqual(result, {
    atRiskLeads: 0,
    potentiallyRecoveredLeads: 0,
    potentialJobs: 0,
    potentialRevenueOpportunity: 0,
  });
});

test("supports fractional opportunities without rounding the underlying logic", () => {
  const result = calculateLeadOpportunity({
    monthlyLeads: 75,
    missedPercentage: 18,
    averageJobValue: 8500,
    closeRate: 22,
    recoverablePercentage: 30,
  });

  assert.equal(result.atRiskLeads, 13.5);
  assert.ok(Math.abs(result.potentiallyRecoveredLeads - 4.05) < Number.EPSILON * 4);
  assert.ok(Math.abs(result.potentialJobs - 0.891) < Number.EPSILON * 4);
  assert.ok(Math.abs(result.potentialRevenueOpportunity - 7573.5) < Number.EPSILON * 1000);
});
