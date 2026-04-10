export const PRESETS = [
  { name: "Starbucks Coffee",    cost: 6.5,  frequency: "daily",   category: "Food" },
  { name: "Energy Drink",        cost: 3.5,  frequency: "daily",   category: "Food" },
  { name: "Lunch Out",           cost: 14,   frequency: "daily",   category: "Food" },
  { name: "Takeout Dinner",      cost: 22,   frequency: "weekly",  category: "Food" },
  { name: "Uber / Lyft",         cost: 18,   frequency: "weekly",  category: "Transport" },
  { name: "Parking",             cost: 15,   frequency: "weekly",  category: "Transport" },
  { name: "Netflix",             cost: 15.49,frequency: "monthly", category: "Subscriptions" },
  { name: "Spotify",             cost: 10.99,frequency: "monthly", category: "Subscriptions" },
  { name: "YouTube Premium",     cost: 13.99,frequency: "monthly", category: "Subscriptions" },
  { name: "Hulu",                cost: 17.99,frequency: "monthly", category: "Subscriptions" },
  { name: "Disney+",             cost: 13.99,frequency: "monthly", category: "Subscriptions" },
  { name: "Amazon Prime",        cost: 14.99,frequency: "monthly", category: "Subscriptions" },
  { name: "Apple iCloud",        cost: 2.99, frequency: "monthly", category: "Subscriptions" },
  { name: "ChatGPT Plus",        cost: 20,   frequency: "monthly", category: "Subscriptions" },
  { name: "Gym Membership",      cost: 40,   frequency: "monthly", category: "Health" },
  { name: "Supplements",         cost: 50,   frequency: "monthly", category: "Health" },
  { name: "Movie Tickets",       cost: 15,   frequency: "weekly",  category: "Entertainment" },
  { name: "Video Games",         cost: 60,   frequency: "monthly", category: "Entertainment" },
  { name: "Online Shopping",     cost: 80,   frequency: "monthly", category: "Shopping" },
  { name: "Alcohol / Bar",       cost: 40,   frequency: "weekly",  category: "Food" },
];

export const presetToHabit = (preset) => ({
  ...preset,
  id: Date.now().toString() + Math.random().toString(36).slice(2),
  createdAt: new Date().toISOString(),
});
