import { Meta } from "@storybook/react-vite";
import { Form } from "react-aria-components";
import { Button } from "../components/ui/aria/Button";
import { DateField } from "../components/ui/aria/DateField";
import { I18nProvider } from "react-aria-components";

const meta: Meta<typeof DateField> = {
  component: DateField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Event date",
  },
};

export default meta;

export const Example = (args: any) => <DateField {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <I18nProvider locale="en-GB">
      <DateField {...args} />
    </I18nProvider>
    <Button type="submit" variant="primary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
