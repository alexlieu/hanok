import { useState } from "react";
import CardDetailsForm from "./CardDetailsForm";

type PaymentFormProps = { temp: string };

const PAYMENT_METHODS = [
  {
    value: "CREDIT",
    label: "Credit Card",
  },
  {
    value: "DEBIT",
    label: "Debit Card",
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

type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"];

const isPaymentMethod = (value: string): value is PaymentMethodValue => {
  return PAYMENT_METHODS.some((method) => method.value === value);
};

const PaymentForm: React.FC<PaymentFormProps> = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethodValue | undefined
  >("DEBIT");

  const updatePaymentMethod = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    if (isPaymentMethod(value)) {
      setSelectedPaymentMethod((prevState) =>
        prevState === value ? undefined : value
      );
    } else {
      console.log("Invalid payment method type: ", value);
    }
  };

  return (
    <>
      <h4>Payment method</h4>
      {selectedPaymentMethod ? <p>{selectedPaymentMethod}</p> : <p>None</p>}
      <ul>
        {PAYMENT_METHODS.map(({ value, label }) => (
          <li key={value}>
            <button type="button" value={value} onClick={updatePaymentMethod}>
              {label}
            </button>
          </li>
        ))}
      </ul>
      {selectedPaymentMethod === "DEBIT" && <CardDetailsForm />}
    </>
  );
};

export default PaymentForm;
