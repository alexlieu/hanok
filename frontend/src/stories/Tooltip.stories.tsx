import type { Meta, StoryObj } from "@storybook/react-vite";

import Tooltip from "../components/ui/Tooltip";

const meta = {
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  args: {
    children: <p>This is a tooltip!</p>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
