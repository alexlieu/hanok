import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioGroup, Radio } from "../components/ui/aria/RadioGroup";
import { Form } from "react-aria-components";
import { Button } from "../components/ui/aria/Button";

const meta = {
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Favorite Sport",
    children: (
      <>
        <Radio value="soccer">Soccer</Radio>
        <Radio value="basketball">basketball</Radio>
        <Radio value="volleyball">volleyball</Radio>
      </>
    ),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    isRequired: true,
    isInvalid: true,
    errorMessage: "Invalid input",
  },
  render: (args) => (
    <Form className="flex flex-col gap-2 items-start">
      <RadioGroup {...args} />
      <Button type="submit" variant="secondary">
        Submit
      </Button>
    </Form>
  ),
};
