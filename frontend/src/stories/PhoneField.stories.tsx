import type { Meta, StoryObj } from "@storybook/react-vite";

import { PhoneField, PhoneFieldProps } from "../components/ui/aria/PhoneField";
import { useState } from "react";
import { CountryCodeUnion } from "../schemas/PhoneSchema";

const meta = {
  component: PhoneField,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PhoneField>;

export default meta;

type Story = StoryObj<typeof meta>;

const PhoneFieldWithState = (
  props: Omit<
    PhoneFieldProps,
    | "phoneNumber"
    | "countryCode"
    | "onPhoneNumberChange"
    | "onCountryCodeChange"
  >
) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCodeUnion>("GB");

  return (
    <PhoneField
      {...props}
      phoneNumber={phoneNumber}
      countryCode={countryCode}
      onPhoneNumberChange={setPhoneNumber}
      onCountryCodeChange={(newCountryCode) => {
        setCountryCode(newCountryCode);
        setPhoneNumber("");
      }}
    />
  );
};

export const Interactive: Story = {
  args: {
    label: "Phone Number (Stateful)",
    description: "This is an interactive example with local state.",
    phoneNumber: "",
    countryCode: "GB",
    onPhoneNumberChange: () => {},
    onCountryCodeChange: () => {},
  },
  render: (args) => <PhoneFieldWithState {...args} />,
};
