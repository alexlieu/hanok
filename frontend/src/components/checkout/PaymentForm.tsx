import CardDetailsForm from "./CardDetailsForm";
import {
  Disclosure,
  DisclosureGroup,
  DisclosureHeader,
  DisclosurePanel,
} from "../ui/aria/Disclosure";
import BillingAddressForm from "./BillingAddressForm";
import {
  PAYMENT_METHODS,
  PaymentMethod,
} from "../../schemas/CustomerFormSchema";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const PaymentForm = () => {
  const { setValue, getValues } = useFormContext();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    () => getValues("paymentMethod") || "card"
  );
  useEffect(() => {
    setValue("paymentMethod", paymentMethod);
  }, [paymentMethod, setValue]);
  return (
    <fieldset className="">
      <legend className="lowercase tracking-wide text-lg font-medium mb-2">
        payment method
      </legend>
      <DisclosureGroup
        className={"space-y-1"}
        allowsMultipleExpanded={false}
        requiresOneOpen={true}
        defaultExpandedKeys={[paymentMethod]}
        onExpandedChange={(keys) =>
          setPaymentMethod(keys.values().next().value as PaymentMethod)
        }
      >
        {PAYMENT_METHODS.map(({ value, label }) => (
          <Disclosure id={value} key={value}>
            <DisclosureHeader variant="tertiary">{label}</DisclosureHeader>
            <DisclosurePanel
              scrollIntoView={true}
              className={`p-4 pt-0 ${value !== "card" && "hidden"}`}
            >
              {value === "card" && (
                <div className="space-y-6">
                  <CardDetailsForm />
                  <BillingAddressForm />
                </div>
              )}
            </DisclosurePanel>
          </Disclosure>
        ))}
      </DisclosureGroup>
    </fieldset>
  );
};

export default PaymentForm;
