import CardDetailsForm from "./CardDetailsForm";
import BillingAddressForm from "./BillingAddressForm";
import { PAYMENT_METHODS } from "../../schemas/CustomerFormSchema";
import {
  DisclosureRadio,
  DisclosureRadioGroup,
  DisclosureRadioHeader,
} from "../ui/aria/DisclosureRadio";
import { Controller, useFormContext } from "react-hook-form";

const PaymentForm = () => {
  const { control } = useFormContext();
  return (
    <fieldset className="">
      <legend className="lowercase tracking-wide text-lg font-medium mb-2">
        payment method
      </legend>
      <Controller
        name="paymentMethod"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <DisclosureRadioGroup
            onChange={onChange}
            value={value}
            className="space-y-1"
            isRequired={true}
            aria-label="Payment Method"
            inputRef={ref}
          >
            {PAYMENT_METHODS.map(({ value, label }) => (
              <DisclosureRadio
                value={value}
                key={value}
                panelContent={
                  value === "card" && (
                    <div className="space-y-6">
                      <CardDetailsForm />
                      <BillingAddressForm />
                    </div>
                  )
                }
              >
                <DisclosureRadioHeader>{label}</DisclosureRadioHeader>
              </DisclosureRadio>
            ))}
          </DisclosureRadioGroup>
        )}
      />
      {/* <DisclosureRadioGroup
        defaultValue="card"
        onChange={(value) => console.log(value)}
        className="space-y-1"
        isRequired={true}
        aria-label="Payment Method"
      >
        {PAYMENT_METHODS.map(({ value, label }) => (
          <DisclosureRadio
            value={value}
            key={value}
            panelContent={
              value === "card" && (
                <div className="space-y-6">
                  <CardDetailsForm />
                  <BillingAddressForm />
                </div>
              )
            }
          >
            <DisclosureRadioHeader>{label}</DisclosureRadioHeader>
          </DisclosureRadio>
        ))}
      </DisclosureRadioGroup> */}
    </fieldset>
  );
};

export default PaymentForm;
