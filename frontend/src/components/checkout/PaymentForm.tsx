import CardDetailsForm from "./CardDetailsForm";
import {
  Disclosure,
  DisclosureGroup,
  DisclosureHeader,
  DisclosurePanel,
} from "../ui/aria/Disclosure";
import BillingAddressForm from "./BillingAddressForm";

const PAYMENT_METHODS = [
  {
    value: "CARD",
    label: "Card",
  },
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "MOBILE",
    label: "Mobile Payment",
  },
  {
    value: "APPLE",
    label: "Apple Pay",
  },
  {
    value: "ANDROID",
    label: "Android Pay",
  },
  {
    value: "PAYPAL",
    label: "Paypal",
  },
  {
    value: "GOOGLE",
    label: "Google Pay",
  },
] as const;

const PaymentForm = () => {
  return (
    <fieldset className="flex flex-col gap-4 mb-5">
      <legend className="uppercase tracking-wide text-xl mb-2">Payment</legend>
      <DisclosureGroup
        className={"flex flex-col gap-2"}
        allowsMultipleExpanded={false}
        requiresOneOpen={true}
        defaultExpandedKeys={["CARD"]}
      >
        {PAYMENT_METHODS.map(({ value, label }) => (
          <Disclosure id={value} key={value}>
            <DisclosureHeader variant="secondary">{label}</DisclosureHeader>
            <DisclosurePanel scrollIntoView={true}>
              {value === "CARD" && (
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
