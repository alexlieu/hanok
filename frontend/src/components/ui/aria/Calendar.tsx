import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarProps as AriaCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  DateValue,
  Heading,
  Text,
  useLocale,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";
import { Button } from "./Button";
import { CalendarDate } from "@internationalized/date";

const cellStyles = tv({
  base: "h-9 text-sm cursor-default flex items-center justify-center focus:outline-none rounded-xs",
  variants: {
    state: {
      default:
        "w-9 m-px focus:bg-brand-colour-3 focus:transition-colors hover:bg-gray-200",
      selected: "w-9 m-px bg-brand-colour-1 invalid:bg-red-600 text-white",
      disabled: "w-9 m-px text-gray-300/90 transition-none",
      unavailable:
        "bg-gray-100 text-gray-300 line-through decoration-2 focus:bg-gray-300 focus:text-gray-100 focus:transition-colors hover:bg-gray-300 hover:text-gray-100 hover:transition-colors",
      unavailable_start: "ml-px",
      unavailable_middle: "w-full",
      unavailable_end: "mr-px",
      unavailable_single: "",
    },
  },
});

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "visibleDuration"> {
  errorMessage?: string;
  unavailableDates?: { start: CalendarDate; end: CalendarDate }[];
}

export function Calendar<T extends DateValue>({
  errorMessage,
  unavailableDates = [],
  ...props
}: CalendarProps<T>) {
  const getUnavailabilityState = (date: DateValue) => {
    for (const range of unavailableDates) {
      if (date.compare(range.start) >= 0 && date.compare(range.end) <= 0) {
        const isStart = date.compare(range.start) === 0;
        const isEnd = date.compare(range.end) === 0;
        if (isStart && isEnd) return "single";
        if (isStart) return "start";
        if (isEnd) return "end";
        return "middle";
      }
    }
    return "none";
  };

  return (
    <AriaCalendar {...props}>
      <CalendarHeader />
      <CalendarGrid>
        <CalendarGridHeader />
        <CalendarGridBody className="overflow-visible">
          {(date) => (
            <CalendarCell
              date={date}
              className={(renderProps) => {
                let state: VariantProps<typeof cellStyles>["state"] = "default";
                let baseStyles: string[] = [];
                if (renderProps.isSelected) {
                  state = "selected";
                } else if (
                  renderProps.isUnavailable &&
                  renderProps.isDisabled
                ) {
                  state = "disabled";
                } else if (renderProps.isUnavailable) {
                  const unavailabilityState = getUnavailabilityState(date);
                  if (unavailabilityState !== "none") {
                    baseStyles.push(cellStyles({ state: "unavailable" }));
                    state = `unavailable_${unavailabilityState}`;
                  } else {
                    state = "disabled";
                  }
                } else if (renderProps.isDisabled) {
                  state = "disabled";
                }
                return [...baseStyles, cellStyles({ state })].join(" ");
              }}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-error-red">
          {errorMessage}
        </Text>
      )}
    </AriaCalendar>
  );
}

export function CalendarHeader() {
  let { direction } = useLocale();
  return (
    <header className="flex justify-between items-center gap-1.5 pb-4 pl-3 pr-2 w-full">
      <Heading
        level={4}
        className="tracking-wide font-medium text-lg text-center"
      />
      <div className="flex gap-2">
        <Button
          variant="icon"
          slot="previous"
          className="hover:bg-stone-200 transition-colors"
        >
          {direction === "rtl" ? (
            <FaChevronRight aria-hidden />
          ) : (
            <FaChevronLeft aria-hidden />
          )}
        </Button>
        <Button
          variant="icon"
          slot="next"
          className="hover:bg-stone-200 transition-colors"
        >
          {direction === "rtl" ? (
            <FaChevronLeft aria-hidden />
          ) : (
            <FaChevronRight aria-hidden />
          )}
        </Button>
      </div>
    </header>
  );
}

export function CalendarGridHeader() {
  return (
    <AriaCalendarGridHeader>
      {(day) => (
        <CalendarHeaderCell className="text-sm font-semibold pb-3">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  );
}
