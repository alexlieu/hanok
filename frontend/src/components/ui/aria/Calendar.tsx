import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarProps as AriaCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  DateRange,
  DateValue,
  Heading,
  Text,
  useLocale,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "./Button";
import { LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import {
  getCssVariableValue,
  shadeOrBlendColor,
} from "../../../utils/colourUtils";

const cellStyles = tv({
  base: "h-9 text-sm cursor-default flex items-center justify-center outline-hidden relative",
  variants: {
    state: {
      default:
        "w-9 m-px hover:bg-brand-colour-2/30 rounded-xs focus:bg-brand-colour-2/30",
      selected: twMerge(
        "w-9 m-px bg-brand-colour-2 text-default-bg font-medium rounded-xs transition-all",
        "invalid:bg-default-bg invalid:border-2 invalid:border-error-red invalid:text-error-red"
      ),
      disabled: "w-9 m-px text-unavailable-text transition-none rounded-xs",
      past_holiday: "text-unavailable-text transition-none",
      unavailable: twMerge(
        "bg-unavailable",
        "focus:bg-unavailable-text focus:text-default-bg focus:transition-colors",
        "hover:bg-icon-pressed hover:text-default-bg hover:transition-colors"
      ),
      unavailable_start: "ml-px rounded-l-xs",
      unavailable_middle: "w-full",
      unavailable_end: "mr-px rounded-r-xs",
      unavailable_single: "rounded-xs",
    },
  },
});

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "visibleDuration"> {
  errorMessage?: string;
  unavailableDates?: DateRange[];
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
          {(date) => {
            const unavailabilityState = getUnavailabilityState(date);
            return (
              <CalendarCell
                date={date}
                className={(renderProps) => {
                  if (renderProps.isInvalid && renderProps.isSelected) {
                    return cellStyles({ state: "selected" });
                  }
                  if (unavailabilityState !== "none") {
                    if (renderProps.isDisabled) {
                      return [
                        cellStyles({ state: "past_holiday" }),
                        cellStyles({
                          state: `unavailable_${unavailabilityState}`,
                        }),
                      ].join(" ");
                    }
                    return [
                      cellStyles({ state: "unavailable" }),
                      cellStyles({
                        state: `unavailable_${unavailabilityState}`,
                      }),
                    ].join(" ");
                  }
                  if (renderProps.isSelected) {
                    return cellStyles({ state: "selected" });
                  }
                  if (renderProps.isDisabled) {
                    return cellStyles({ state: "disabled" });
                  }
                  return cellStyles({ state: "default" });
                }}
              >
                {(renderProps) => {
                  const isPastHoliday =
                    renderProps.isUnavailable && renderProps.isDisabled;
                  const shouldShowCross =
                    (renderProps.isUnavailable && !renderProps.isDisabled) ||
                    renderProps.isInvalid ||
                    isPastHoliday;
                  const getCrossColor = () => {
                    if (renderProps.isInvalid) return "var(--color-error-red)";
                    if (isPastHoliday)
                      return shadeOrBlendColor(
                        0.3,
                        getCssVariableValue("--color-unavailable-text")
                      );
                    if (renderProps.isFocused || renderProps.isHovered)
                      return "var(--color-default-bg)";
                    return "var(--color-icon-pressed)";
                  };
                  return (
                    <>
                      {shouldShowCross && (
                        <LuX
                          className="absolute size-2.5 bottom-1"
                          stroke={getCrossColor()}
                          strokeWidth={5}
                          strokeOpacity={1}
                        />
                      )}
                      <span className="absolute mb-2">
                        {renderProps.formattedDate}
                      </span>
                    </>
                  );
                }}
              </CalendarCell>
            );
          }}
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
  const { direction } = useLocale();
  return (
    <header className="flex justify-between items-center gap-1.5 pb-4 pl-3 pr-2 w-full">
      <Heading
        level={4}
        className="tracking-wide font-medium text-lg text-center"
      />
      <div className="flex gap-2">
        <Button variant="icon" slot="previous" invisibleOnDisabled>
          {direction === "rtl" ? (
            <FaChevronRight aria-hidden />
          ) : (
            <FaChevronLeft aria-hidden />
          )}
        </Button>
        <Button variant="icon" slot="next" invisibleOnDisabled>
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
