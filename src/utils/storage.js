import AsyncStorage from "@react-native-async-storage/async-storage";

const HABITS_KEY = "@habitcost_habits";
const WAGE_KEY = "@habitcost_wage";

export const loadHabits = async () => {
  try {
    const json = await AsyncStorage.getItem(HABITS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("loadHabits error:", e);
    return [];
  }
};

export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error("saveHabits error:", e);
  }
};

export const loadWage = async () => {
  try {
    const val = await AsyncStorage.getItem(WAGE_KEY);
    return val ? parseFloat(val) : null;
  } catch (e) {
    return null;
  }
};

export const saveWage = async (wage) => {
  try {
    await AsyncStorage.setItem(WAGE_KEY, String(wage));
  } catch (e) {
    console.error("saveWage error:", e);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.multiRemove([HABITS_KEY, WAGE_KEY]);
  } catch (e) {
    console.error("clearAll error:", e);
  }
};
