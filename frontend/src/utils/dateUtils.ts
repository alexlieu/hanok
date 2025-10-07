import { DateValue } from "react-aria-components";
import { DateRange } from "../types/DateTypes";

export function isDateInRanges(
  dateToCheck: DateValue,
  ranges: DateRange[]
): boolean {
  for (const range of ranges)
    if (
      dateToCheck.compare(range.start) >= 0 &&
      dateToCheck.compare(range.end) <= 0
    ) {
      return true;
    }
  return false;
}
