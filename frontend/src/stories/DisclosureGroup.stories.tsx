import { Meta, StoryObj } from "@storybook/react-vite";
import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
  DisclosureGroup,
} from "../components/ui/aria/Disclosure";

const meta: Meta<typeof DisclosureGroup> = {
  component: DisclosureGroup,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: (args) => (
    <DisclosureGroup {...args}>
      <Disclosure>
        <DisclosureHeader>Files</DisclosureHeader>
        <DisclosurePanel>Files content...</DisclosurePanel>
      </Disclosure>
      <Disclosure>
        <DisclosureHeader>Image</DisclosureHeader>
        <DisclosurePanel>Images content...</DisclosurePanel>
      </Disclosure>
      <Disclosure>
        <DisclosureHeader>Documents</DisclosureHeader>
        <DisclosurePanel>Documents content...</DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  ),
};
