import type { Meta, StoryObj } from "@storybook/react-vite";

import PickupMap from "../components/checkout/PickupMap";

const meta = {
  component: PickupMap,
} satisfies Meta<typeof PickupMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-1/3">
      <PickupMap {...args} />
    </div>
  ),
};
