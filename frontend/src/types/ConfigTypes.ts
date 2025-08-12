export type PickupRules = {
  requiredLeadDays: number;
  cutOffHour: number;
  cutOffMin: number;
  maxMonth: number;
  timezone: string;
  holidayRanges: { start: Date; end: Date }[];
};
