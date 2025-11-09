import type { Meta, StoryObj } from "@storybook/react-vite";

import { ClickBurstIcon } from "../components/ui/icons/ClickBurst";

const meta = {
  component: ClickBurstIcon,
  tags: ["autodocs"],
  argTypes: {
    playAnimation: {
      control: "boolean",
      description: "Triggers the burst animation",
    },
    size: {
      control: "number",
    },
    stroke: {
      control: "color",
    },
  },
} satisfies Meta<typeof ClickBurstIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playAnimation: false,
    size: 48,
    stroke: "#000000",
  },
  render: (args) => (
    <div className="p-10 bg-gray-200 rounded-lg">
      <ClickBurstIcon {...args} />
    </div>
  ),
};
