import type { Meta, StoryObj } from "@storybook/react-vite";

import NumberCardFieldGroup from "../components/ui/NumberCardFieldGroup";

const meta = {
  component: NumberCardFieldGroup,
  parameters: {
    layout: "",
  },
} satisfies Meta<typeof NumberCardFieldGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cardNo: "cardNo",
    expiration: "expiration",
    cvv: "cvv",
    onCardNoChange: () => {},
    onExpirationChange: () => {},
    onCVVChange: () => {},
    cardNoRef: {},
    expirationRef: {},
    cvvRef: {},
  },
};
