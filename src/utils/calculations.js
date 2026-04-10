const MULTIPLIERS = {
  daily: 365,
  weekly: 52,
  monthly: 12,
};

export const getYearlyCost = (cost, frequency) => {
  return parseFloat(cost) * (MULTIPLIERS[frequency] || 12);
};

export const getMonthlyCost = (cost, frequency) => {
  return getYearlyCost(cost, frequency) / 12;
};

export const getTotalMonthly = (habits) => {
  return habits.reduce((sum, h) => sum + getMonthlyCost(h.cost, h.frequency), 0);
};

export const getTotalYearly = (habits) => {
  return habits.reduce((sum, h) => sum + getYearlyCost(h.cost, h.frequency), 0);
};

export const getTimeCost = (habits, hourlyWage) => {
  if (!hourlyWage || hourlyWage <= 0) return 0;
  return getTotalYearly(habits) / parseFloat(hourlyWage);
};

export const getTenYearTotal = (habits) => {
  return getTotalYearly(habits) * 10;
};

export const getInvestmentFV = (habits, years = 10) => {
  const monthly = getTotalMonthly(habits);
  const r = 0.07 / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
};

export const getGoalMonths = (habits, goalCost) => {
  const monthly = getTotalMonthly(habits);
  if (monthly <= 0) return Infinity;
  return Math.ceil(goalCost / monthly);
};

export const getCategoryBreakdown = (habits) => {
  const breakdown = {};
  habits.forEach((h) => {
    const yearly = getYearlyCost(h.cost, h.frequency);
    breakdown[h.category] = (breakdown[h.category] || 0) + yearly;
  });
  return breakdown;
};

export const getSortedByExpense = (habits) => {
  return [...habits].sort(
    (a, b) =>
      getYearlyCost(b.cost, b.frequency) - getYearlyCost(a.cost, a.frequency)
  );
};
