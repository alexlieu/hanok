import { now, parseDate } from "@internationalized/date";
import {
  ConfiguredPickupRules,
  PickupRulesResponse,
} from "../../types/ConfigTypes";
import { ValidStatesProvincesRegions } from "../../types/ValidStatesProvincesRegions";

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
    const { timezone, holidayRanges, firstValidDate, lastValidDate } = data;

    const unavailableDates = holidayRanges.map((range) => ({
      start: parseDate(range.start),
      end: parseDate(range.end),
    }));

    return {
      firstValidDate: parseDate(firstValidDate),
      lastValidDate: parseDate(lastValidDate),
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
