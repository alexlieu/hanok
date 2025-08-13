import { PickupRules } from "../../types/ConfigTypes";
import { parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const getPickupRules = async (): Promise<PickupRules> => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/config/pickup-rules"
    );
    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }
    const data = await response.json();
    const { timezone } = data;
    const convertedHolidayRanges = data.holidayRanges.map(
      (range: { start: string; end: string }) => {
        const startUTC = parseISO(range.start);
        const endUTC = parseISO(range.end);
        return {
          start: toZonedTime(startUTC, timezone),
          end: toZonedTime(endUTC, timezone),
        };
      }
    );
    const convertedRules: PickupRules = {
      ...data,
      holidayRanges: convertedHolidayRanges,
      receivedAt: new Date(),
    };
    return convertedRules;
  } catch (error) {
    console.log("Failed to fetch pickup rules: ", error);
    throw new Error(
      "Could not retrieve pickup rules due to a network or server error."
    );
  }
};

export default getPickupRules;
