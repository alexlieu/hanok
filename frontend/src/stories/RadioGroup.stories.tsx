import { Form } from "react-aria-components";
import { Button } from "../components/ui/aria/Button";
import { Radio, RadioGroup } from "../components/ui/aria/RadioGroup";
import { Meta } from "@storybook/react-vite";

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Favorite Sport",
    isDisabled: false,
    isRequired: false,
    description: "",
    children: (
      <>
        <Radio value="soccer">Soccer</Radio>
        <Radio value="basketball">basketball</Radio>
        <Radio value="volleyball">volleyball</Radio>
      </>
    ),
  },
};

export default meta;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Validation = (args: any) => {
  return (
    <Form className="flex flex-col gap-2 items-start">
      <RadioGroup {...args} />
      <Button type="submit" variant="secondary">
        Submit
      </Button>
    </Form>
  );
};

Validation.args = { isRequired: true };
