export type RoiInputs = {
  monthlyLeads: number;
  missedPercentage: number;
  averageJobValue: number;
  closeRate: number;
  recoverablePercentage: number;
};

export type RoiResult = {
  atRiskLeads: number;
  potentiallyRecoveredLeads: number;
  potentialJobs: number;
  potentialRevenueOpportunity: number;
};

export function calculateLeadOpportunity(inputs: RoiInputs): RoiResult {
  const monthlyLeads = Math.max(0, inputs.monthlyLeads);
  const missedPercentage = clampPercent(inputs.missedPercentage);
  const averageJobValue = Math.max(0, inputs.averageJobValue);
  const closeRate = clampPercent(inputs.closeRate);
  const recoverablePercentage = clampPercent(inputs.recoverablePercentage);

  const atRiskLeads = monthlyLeads * missedPercentage;
  const potentiallyRecoveredLeads = atRiskLeads * recoverablePercentage;
  const potentialJobs = potentiallyRecoveredLeads * closeRate;
  const potentialRevenueOpportunity = potentialJobs * averageJobValue;

  return {
    atRiskLeads,
    potentiallyRecoveredLeads,
    potentialJobs,
    potentialRevenueOpportunity,
  };
}

function clampPercent(value: number) {
  return Math.min(1, Math.max(0, value / 100));
}
