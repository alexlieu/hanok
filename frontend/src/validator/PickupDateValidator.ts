export const isPickupValid = (input: string) => {
  const dateInput = new Date(input);
  dateInput.setHours(0, 0, 0, 0);
  const { lower, upper } = getValidDateRange();
  if (dateInput < lower) return false;
  if (dateInput > upper) return false;
  return true;
};

export const getFirstValidDate = () => {
  const firstValidDate = new Date();
  firstValidDate.setDate(firstValidDate.getDate() + 3);
  firstValidDate.setHours(0, 0, 0, 0);
  return firstValidDate;
};

export const getLastValidDate = () => {
  const lastValidDate = new Date();
  lastValidDate.setMonth(lastValidDate.getMonth() + 2);
  lastValidDate.setHours(0, 0, 0, 0);
  return lastValidDate;
};

export const getValidDateRange = () => {
  const lower = getFirstValidDate();
  const upper = getLastValidDate();
  return { lower, upper };
};

export const formatDateString = (date: Date) => {
  return date.toISOString().split("T")[0];
};
