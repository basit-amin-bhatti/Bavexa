export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(amount);
}

type UsageTerms = {
  includedCallMinutes: number | null;
  overagePerMinute: number | null;
};

export function getUsageDisclosure({ includedCallMinutes, overagePerMinute }: UsageTerms) {
  if (includedCallMinutes === null && overagePerMinute === null) {
    return "Monthly call allowance and any additional usage charges are confirmed in your proposal before you commit.";
  }

  const allowance = includedCallMinutes === null
    ? "Included call minutes will be confirmed in your proposal."
    : `Includes ${new Intl.NumberFormat("en-US").format(includedCallMinutes)} call minutes per month.`;
  const overage = overagePerMinute === null
    ? "Any overage rates will be confirmed in your proposal before you commit."
    : `Additional minutes: ${formatUsd(overagePerMinute)}/minute.`;
  return `${allowance} ${overage}`;
}
