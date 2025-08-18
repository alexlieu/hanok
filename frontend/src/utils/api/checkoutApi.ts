import {
  CalendarDate,
  now,
  parseDate,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import {
  ConfiguredPickupRules,
  PickupRulesResponse,
} from "../../types/ConfigTypes";
import { DateValue } from "react-aria-components";
// import { parseISO } from "date-fns";
// import { toZonedTime } from "date-fns-tz";

const getPickupRules = async (): Promise<ConfiguredPickupRules> => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/config/pickup-rules"
    );
    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }
    const data = (await response.json()) as PickupRulesResponse;
    const {
      requiredLeadDays,
      cutoffHour,
      cutoffMin,
      maxMonth,
      timezone,
      holidayRanges,
    } = data;

    const cutoffTime: ZonedDateTime = now(timezone).set({
      hour: cutoffHour,
      minute: cutoffMin,
      second: 0,
      millisecond: 0,
    });

    const firstValidDate: CalendarDate =
      now(timezone).compare(cutoffTime) < 0
        ? today(timezone).add({ days: requiredLeadDays + 1 })
        : today(timezone).add({ days: requiredLeadDays });

    const lastValidDate: CalendarDate = firstValidDate.add({
      months: maxMonth,
    });

    function isHoliday(dateToCheck: DateValue): boolean {
      for (const range of holidayRanges) {
        if (
          dateToCheck.compare(parseDate(range.start)) >= 0 &&
          dateToCheck.compare(parseDate(range.end)) <= 0
        ) {
          return true;
        }
      }
      return false;
    }

    const unavailableDates = holidayRanges.map((range) => ({
      start: parseDate(range.start),
      end: parseDate(range.end),
    }));

    return {
      firstValidDate,
      lastValidDate,
      isHoliday,
      unavailableDates,
      receivedAt: now(timezone),
    } as ConfiguredPickupRules;
  } catch (error) {
    console.log("Failed to fetch pickup rules: ", error);
    throw new Error(
      "Could not retrieve pickup rules due to a network or server error."
    );
  }
};

export default getPickupRules;
