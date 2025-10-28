export const calculateProgress = (raised: number, goal: number): number => {
  return goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
};

