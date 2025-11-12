import { DayOfWeek, now, parseDate, parseTime } from "@internationalized/date";
import {
  ConfiguredPickupRules,
  PickupRulesResponse,
} from "../../types/ConfigTypes";
import { ValidStatesProvincesRegions } from "../../types/ValidStatesProvincesRegions";

/**
 * Converts Java's DayOfWeek enum string (e.g., "MONDAY", "TUESDAY") to
 * @internationalized/date DayOfWeek numeric value (0-6, where 0=Sunday, 1=Monday, etc.)
 */
function parseDayOfWeek(javaDayOfWeek: string): DayOfWeek {
  const dayMap: Record<string, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0, // Java uses 7, but @internationalized/date uses 0 for Sunday
  };

  const normalizedDay = javaDayOfWeek.trim().toUpperCase();
  const dayOfWeek = dayMap[normalizedDay];

  if (dayOfWeek === undefined) {
    throw new Error(
      `Invalid day of week: ${javaDayOfWeek}. Expected one of: ${Object.keys(
        dayMap
      ).join(", ")}`
    );
  }

  return dayOfWeek as unknown as DayOfWeek;
}

export const getPickupRules = async (): Promise<ConfiguredPickupRules> => {
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
      timezone,
      holidayRanges,
      firstValidDate,
      lastValidDate,
      pickupSlots: rawPickupSlots,
      openingHours: rawOpeningHours,
    } = data;

    const pickupSlots = rawPickupSlots.map((slot) => ({
      value: slot.value,
      label: slot.label,
      start: parseTime(slot.start),
      end: parseTime(slot.end),
    }));

    const openingHours = rawOpeningHours.map((hour) => ({
      dayOfWeek: parseDayOfWeek(hour.dayOfWeek),
      timeRange: {
        label: hour.timeRange.label,
        start: parseTime(hour.timeRange.start),
        end: parseTime(hour.timeRange.end),
      },
    }));

    const unavailableDates = holidayRanges.map((range) => ({
      start: parseDate(range.start),
      end: parseDate(range.end),
    }));

    return {
      firstValidDate: parseDate(firstValidDate),
      lastValidDate: parseDate(lastValidDate),
      unavailableDates,
      receivedAt: now(timezone),
      pickupSlots,
      openingHours,
    } as ConfiguredPickupRules;
  } catch (error) {
    console.log("Failed to fetch pickup rules: ", error);
    throw new Error(
      "Could not retrieve pickup rules due to a network or server error."
    );
  }
};

export const getValidStatesProvincesRegions =
  async (): Promise<ValidStatesProvincesRegions> => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/config/addresses/statesProvincesRegions"
      );
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`
        );
      }
      const { US_STATES, CA_PROVINCES, KR_PROVINCES } =
        (await response.json()) as {
          US_STATES: Record<string, string>;
          CA_PROVINCES: Record<string, string>;
          KR_PROVINCES: string[];
        };

      return {
        US_STATES,
        CA_PROVINCES,
        KR_PROVINCES: new Set(KR_PROVINCES),
      } as ValidStatesProvincesRegions;
    } catch (error) {
      console.log("Failed to fetch valid states/provinces/regions: ", error);
      throw new Error(
        "Could not retrieve valid states/provinces/regions due to a network or server error."
      );
    }
  };
