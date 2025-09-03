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
import { LuX } from "react-icons/lu";

const cellStyles = tv({
  base: "h-9 text-sm cursor-default flex items-center justify-center outline-hidden relative",
  variants: {
    state: {
      default:
        "w-9 m-px hover:bg-brand-colour-2/30 rounded-xs focus:bg-brand-colour-2/30",
      selected:
        "w-9 m-px bg-brand-colour-2 text-default-bg font-medium transition-all rounded-xs invalid:bg-default-bg invalid:border-2 invalid:border-error-red invalid:text-error-red",
      disabled: "w-9 m-px text-unavailable-text transition-none rounded-xs",
      unavailable:
        "bg-unavailable focus:bg-unavailable-text focus:text-default-bg focus:transition-colors hover:bg-icon-pressed hover:text-default-bg hover:transition-colors",
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
                const baseStyles: string[] = [];
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
            >
              {(renderProps) => (
                <>
                  {renderProps.isUnavailable && !renderProps.isDisabled ? (
                    <>
                      <LuX
                        className="absolute size-2.5 bottom-1"
                        stroke={
                          renderProps.isFocused || renderProps.isHovered
                            ? renderProps.isInvalid
                              ? "var(--color-error-red)"
                              : "var(--color-default-bg)"
                            : renderProps.isInvalid
                            ? "var(--color-error-red)"
                            : "var(--color-icon-pressed)"
                        }
                        strokeWidth={5}
                        strokeOpacity={1}
                      />
                      <span className="absolute mb-2">
                        {renderProps.formattedDate}
                      </span>
                    </>
                  ) : (
                    <>
                      {renderProps.isInvalid && (
                        <LuX
                          className="absolute size-2.5 bottom-1"
                          stroke="var(--color-error-red)"
                          strokeWidth={5}
                          strokeOpacity={1}
                        />
                      )}
                      <span className="absolute mb-2">
                        {renderProps.formattedDate}
                      </span>
                    </>
                  )}
                </>
              )}
            </CalendarCell>
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
