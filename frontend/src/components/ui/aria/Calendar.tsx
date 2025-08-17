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
import { tv } from "tailwind-variants";
import { Button } from "./Button";

const cellStyles = tv({
  base: "w-9 h-9 m-px text-sm cursor-default flex items-center justify-center transition-all focus:outline-none ",
  variants: {
    isSelected: {
      false: "pressed:bg-gray-200 focus:bg-brand-colour-3 hover:bg-stone-200",
      true: "bg-brand-colour-1 invalid:bg-red-600 text-white",
    },
    isDisabled: {
      true: "text-gray-300/90",
    },
  },
  compoundVariants: [],
});

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "visibleDuration"> {
  errorMessage?: string;
}

export function Calendar<T extends DateValue>({
  errorMessage,
  ...props
}: CalendarProps<T>) {
  return (
    <AriaCalendar {...props}>
      <CalendarHeader />
      <CalendarGrid>
        <CalendarGridHeader />
        <CalendarGridBody className="overflow-visible">
          {(date) => <CalendarCell date={date} className={cellStyles} />}
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
    <header className="flex items-center gap-1 pb-4 px-2 w-full">
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
      <Heading
        level={4}
        className="flex-1 tracking-wide font-medium text-xl text-center mx-2"
      />
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
    </header>
  );
}

export function CalendarGridHeader() {
  return (
    <AriaCalendarGridHeader>
      {(day) => (
        <CalendarHeaderCell className="text-sm font-semibold py-1">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  );
}
