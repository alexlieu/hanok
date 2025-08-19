import { Calendar } from "../components/ui/aria/Calendar";

import { getLocalTimeZone, today } from "@internationalized/date";
import { Meta, StoryObj } from "@storybook/react";
import { DateValue } from "react-aria-components";

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  parameters: {
    layout: "centered",
    backgrounds: {
      options: {
        default: { name: "default", value: "#F0F1F2" },
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Example = (args: any) => (
  <Calendar aria-label="Event date" {...args} />
);

const dateToday = today(getLocalTimeZone());
const lowerBound = dateToday.add({ days: 3 });
const upperBound = dateToday.add({ days: 10 });

function isUnavailable(date: DateValue) {
  if (date.compare(lowerBound) >= 0 && date.compare(upperBound) <= 0)
    return true;
  return false;
}

export const UnavailableDates: Story = {
  args: {
    isDateUnavailable: isUnavailable,
    unavailableDates: [{ start: lowerBound, end: upperBound }],
  },
};
