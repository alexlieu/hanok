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
    <fieldset className="flex flex-col gap-4 mb-5">
      <legend className="uppercase tracking-wide text-xl mb-2">Payment</legend>
      <DisclosureGroup
        className={"flex flex-col gap-2"}
        allowsMultipleExpanded={false}
        requiresOneOpen={true}
        defaultExpandedKeys={[paymentMethod]}
        onExpandedChange={(keys) =>
          setPaymentMethod(keys.values().next().value as PaymentMethod)
        }
      >
        {PAYMENT_METHODS.map(({ value, label }) => (
          <Disclosure id={value} key={value}>
            <DisclosureHeader variant="secondary">{label}</DisclosureHeader>
            <DisclosurePanel scrollIntoView={true}>
              {value === "card" && (
                <div className="flex flex-col gap-4">
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
