import { useMemo } from "react";
import {
  getTotalMonthly,
  getTotalYearly,
  getTimeCost,
  getTenYearTotal,
  getInvestmentFV,
  getGoalMonths,
  getCategoryBreakdown,
  getSortedByExpense,
} from "../utils/calculations";

export const useInsights = (habits, hourlyWage = 0) => {
  return useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        totalMonthly: 0,
        totalYearly: 0,
        timeCostHours: 0,
        tenYearTotal: 0,
        investmentFV: 0,
        categoryBreakdown: {},
        topHabits: [],
        getGoalMonths: () => 0,
      };
    }
    return {
      totalMonthly: getTotalMonthly(habits),
      totalYearly: getTotalYearly(habits),
      timeCostHours: getTimeCost(habits, hourlyWage),
      tenYearTotal: getTenYearTotal(habits),
      investmentFV: getInvestmentFV(habits, 10),
      categoryBreakdown: getCategoryBreakdown(habits),
      topHabits: getSortedByExpense(habits).slice(0, 3),
      getGoalMonths: (goalCost) => getGoalMonths(habits, goalCost),
    };
  }, [habits, hourlyWage]);
};
