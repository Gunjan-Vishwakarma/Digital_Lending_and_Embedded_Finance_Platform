/**
 * Format a number as USD currency.
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a decimal as a percentage string.
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format an ISO date string to a readable locale string.
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format an ISO date string to include time.
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate EMI using the standard formula.
 * P × r × (1+r)^n / ((1+r)^n - 1)
 */
export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): number => {
  if (annualRate === 0) return principal / tenureMonths;
  const r = annualRate / 100 / 12;
  const n = tenureMonths;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

/**
 * Generate a full amortization schedule.
 */
export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  tenureMonths: number
) => {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const r = annualRate / 100 / 12;
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPaid = balance * r;
    const principalPaid = emi - interestPaid;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      emiAmount: Math.round(emi * 100) / 100,
      principalPaid: Math.round(principalPaid * 100) / 100,
      interestPaid: Math.round(interestPaid * 100) / 100,
      remainingBalance: Math.round(balance * 100) / 100,
    });
  }

  return schedule;
};

/**
 * Get CSS class for loan status badges.
 */
export const getLoanStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    DRAFT: 'badge-neutral',
    UNDERWRITING: 'badge-warning',
    FUNDING: 'badge-info',
    ACTIVE: 'badge-success',
    CLOSED: 'badge-neutral',
    DEFAULTED: 'badge-danger',
  };
  return map[status] || 'badge-neutral';
};

/**
 * Get CSS class for risk tier badges.
 */
export const getRiskTierColor = (tier: string): string => {
  const map: Record<string, string> = {
    A: 'tier-a',
    B: 'tier-b',
    C: 'tier-c',
    D: 'tier-d',
    E: 'tier-e',
  };
  return map[tier] || 'tier-c';
};

/**
 * Truncate a string with ellipsis.
 */
export const truncate = (str: string, length = 50): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '…';
};
