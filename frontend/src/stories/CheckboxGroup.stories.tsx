import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox, CheckboxGroup } from "../components/ui/aria/Checkbox";
import { Form } from "react-aria-components";
import { Button } from "../components/ui/aria/Button";

const meta = {
  component: CheckboxGroup,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Cities",
    children: (
      <>
        <Checkbox value="sf">San Francisco</Checkbox>
        <Checkbox value="ny">New York</Checkbox>
        <Checkbox value="sydney">Sydney</Checkbox>
        <Checkbox value="london">London</Checkbox>
        <Checkbox value="tokyo">Tokyo</Checkbox>
      </>
    ),
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description: "Cities of the world.",
  },
};

export const Invalid: Story = {
  args: {
    isRequired: true,
    isInvalid: true,
    errorMessage: "Invalid input.",
  },
  render: (args) => (
    <Form className="flex flex-col gap-2 items-start">
      <CheckboxGroup {...args} />
      <Button type="submit" variant="secondary">
        Submit
      </Button>
    </Form>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};
