import CardDetailsForm from "./CardDetailsForm";
import BillingAddressForm from "./BillingAddressForm";
import { PAYMENT_METHODS } from "../../schemas/CustomerFormSchema";
import {
  DisclosureRadio,
  DisclosureRadioGroup,
  DisclosureRadioHeader,
} from "../ui/aria/DisclosureRadio";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

const PaymentForm = () => {
  const { control, clearErrors } = useFormContext();
  const paymentMethod = useWatch({ name: "paymentMethod", control });

  // Clear validation errors for card and billing address fields when payment method is not "card"
  // BUT keep the field values
  useEffect(() => {
    if (paymentMethod !== "card") {
      clearErrors("cardNumber");
      clearErrors("expiration");
      clearErrors("cvv");
      clearErrors("holderName");

      clearErrors("country");
      clearErrors("addressLine1");
      clearErrors("addressLine2");
      clearErrors("city");
      clearErrors("stateProvinceRegion");
      clearErrors("county");
      clearErrors("postalCode");
    }
  }, [paymentMethod, clearErrors]);

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
