import { Meta } from "@storybook/react-vite";
import { Form } from "react-aria-components";
import { Button } from "../components/ui/aria/Button";
import { TextField } from "../components/ui/aria/TextField";

const meta: Meta<typeof TextField> = {
  component: TextField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Name",
  },
};

export default meta;

export const example = (args: any) => <TextField {...args} />;

export const validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <TextField {...args} />
    <Button type="submit" variant="secondary">
      submit
    </Button>
  </Form>
);

validation.args = {
  isRequired: true,
};
