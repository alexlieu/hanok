import type { Meta, StoryObj } from "@storybook/react-vite";

import NumberCardFieldGroup from "../components/ui/NumberCardFieldGroup";
import { TextField } from "../components/ui/aria/TextField";

const meta = {
  component: NumberCardFieldGroup,
  parameters: {
    layout: "",
  },
  args: {
    cardNoField: (
      <TextField placeholder="1234 1234 1234 1234" borderless="forCardNo" />
    ),
    expirationField: <TextField placeholder="MM/YY" borderless="default" />,
    cvvField: <TextField placeholder="CVV" borderless="default" />,
  },
} satisfies Meta<typeof NumberCardFieldGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isRequired: true,
    description: "These are required fields for a card payment.",
    isInvalid: true,
  },
};
