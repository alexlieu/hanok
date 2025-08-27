import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextArea } from "../components/ui/aria/TextArea";

const meta = {
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Special instructions",
  },
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
