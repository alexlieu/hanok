import { CalendarDate, ZonedDateTime } from "@internationalized/date";
import { DateValue } from "react-aria-components";

export type PickupRules = {
  requiredLeadDays: number;
  cutoffHour: number;
  cutoffMin: number;
  maxMonth: number;
  timezone: string;
  holidayRanges: { start: CalendarDate; end: CalendarDate }[];
  receivedAt: Date;
};

export interface ConfiguredPickupRules {
  firstValidDate: CalendarDate;
  lastValidDate: CalendarDate;
  isHoliday: (pickupDate: DateValue) => boolean;
  unavailableDates: { start: CalendarDate; end: CalendarDate }[];
  receivedAt: ZonedDateTime;
}

export type PickupRulesResponse = {
  requiredLeadDays: number;
  cutoffHour: number;
  cutoffMin: number;
  maxMonth: number;
  timezone: string;
  holidayRanges: { start: string; end: string }[];
};
