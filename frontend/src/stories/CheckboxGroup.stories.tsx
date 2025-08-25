import { Form } from "react-aria-components";
import { Button } from "../components/ui/aria/Button";
import { Checkbox, CheckboxGroup } from "../components/ui/aria/Checkbox";
import { Meta } from "@storybook/react-vite";

const meta: Meta<typeof CheckboxGroup> = {
  component: CheckboxGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Cities",
    isDisabled: false,
    isRequired: false,
    description: "",
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
};

export default meta;

export const Default = {
  args: {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Validation = (args: any) => {
  return (
    <Form className="flex flex-col gap-2 items-start">
      <CheckboxGroup {...args} />
      <Button type="submit" variant="secondary">
        Submit
      </Button>
    </Form>
  );
};

Validation.args = {
  isRequired: true,
};
