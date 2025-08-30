import { Meta, StoryObj } from "@storybook/react-vite";
import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "../components/ui/aria/Disclosure";
import { TextArea } from "../components/ui/aria/TextArea";

const meta: Meta<typeof Disclosure> = {
  component: Disclosure,
  parameters: {
    layout: "centered",
  },
  args: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: (args) => (
    <Disclosure {...args}>
      <DisclosureHeader>Files</DisclosureHeader>
      <DisclosurePanel>
        <TextArea label="Write to file..." />
      </DisclosurePanel>
    </Disclosure>
  ),
};
