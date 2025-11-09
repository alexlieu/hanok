import { CalendarDate, ZonedDateTime } from "@internationalized/date";
import { DateRange } from "./DateTypes";

export interface ConfiguredPickupRules {
  firstValidDate: CalendarDate;
  lastValidDate: CalendarDate;
  unavailableDates: DateRange[];
  receivedAt: ZonedDateTime;
}

export type PickupRulesResponse = {
  requiredLeadDays: number;
  cutoffHour: number;
  cutoffMin: number;
  maxMonth: number;
  timezone: string;
  holidayRanges: { start: string; end: string }[];
  firstValidDate: string;
  lastValidDate: string;
};
