import { addDays, addMonths, isBefore, set, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const isPickupValid = (
  input: string,
  requiredLeadDays: number,
  maxMonth: number,
  cutOffHour: number,
  cutOffMin: number,
  timezone: string
) => {
  const dateInput = new Date(input);
  dateInput.setHours(0, 0, 0, 0);
  const { lower, upper } = getValidDateRange(
    requiredLeadDays,
    maxMonth,
    cutOffHour,
    cutOffMin,
    timezone
  );
  if (dateInput < lower) return false;
  if (dateInput > upper) return false;
  return true;
};

export const getCutOffPenalty = (
  cutOffHour: number,
  cutOffMin: number,
  timezone: string
) => {
  const now = startOfDay(toZonedTime(new Date(), timezone));
  return isBefore(
    now,
    set(now, { hours: cutOffHour, minutes: cutOffMin, seconds: 0 })
  )
    ? { cutOffPenalty: 0, cutOffPenaltyApplied: addDays(now, 0) }
    : { cutOffPenalty: 1, cutOffPenaltyApplied: addDays(now, 1) };
};

export const getFirstValidDate = (
  requiredLeadDays: number,
  cutOffHour: number,
  cutOffMin: number,
  timezone: string
) => {
  const { cutOffPenaltyApplied } = getCutOffPenalty(
    cutOffHour,
    cutOffMin,
    timezone
  );
  const firstValidDate = addDays(cutOffPenaltyApplied, requiredLeadDays);
  return firstValidDate;
};

export const getLastValidDate = (
  maxMonth: number,
  cutOffHour: number,
  cutOffMin: number,
  timezone: string
) => {
  const { cutOffPenaltyApplied } = getCutOffPenalty(
    cutOffHour,
    cutOffMin,
    timezone
  );
  const lastValidDate = addMonths(cutOffPenaltyApplied, maxMonth);
  return lastValidDate;
};

export const getValidDateRange = (
  requiredLeadDays: number,
  maxMonth: number,
  cutOffHour: number,
  cutOffMin: number,
  timezone: string
) => {
  const lower = getFirstValidDate(
    requiredLeadDays,
    cutOffHour,
    cutOffMin,
    timezone
  );
  const upper = getLastValidDate(maxMonth, cutOffHour, cutOffMin, timezone);
  return { lower, upper };
};
