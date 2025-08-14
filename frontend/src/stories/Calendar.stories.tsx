import { Calendar } from "../components/ui/aria/Calendar";

import { Meta } from "@storybook/react";

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

export const Example = (args: any) => (
  <Calendar aria-label="Event date" {...args} />
);
