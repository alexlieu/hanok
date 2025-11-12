import {
  CalendarDate,
  DayOfWeek,
  Time,
  ZonedDateTime,
} from "@internationalized/date";
import { DateRange } from "./DateTypes";

export interface ConfiguredPickupRules {
  firstValidDate: CalendarDate;
  lastValidDate: CalendarDate;
  unavailableDates: DateRange[];
  receivedAt: ZonedDateTime;
  pickupSlots: { value: string; label: string; start: Time; end: Time }[];
  openingHours: {
    dayOfWeek: DayOfWeek;
    timeRange: { label: string; start: Time; end: Time };
  }[];
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
  pickupSlots: { value: string; label: string; start: string; end: string }[];
  openingHours: {
    dayOfWeek: string;
    timeRange: { label: string; start: string; end: string };
  }[];
};
