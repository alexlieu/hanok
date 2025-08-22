import { Meta } from "@storybook/react-vite";
import { PhoneField } from "../components/ui/aria/PhoneField";
import { CountryCodeUnion } from "../schemas/PhoneSchema";
import { useState } from "react";

const meta: Meta<typeof PhoneField> = {
  component: PhoneField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Phone number",
  },
};

export default meta;

export const Example = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<CountryCodeUnion>("GB");

  return (
    <PhoneField
      label="Phone number"
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
