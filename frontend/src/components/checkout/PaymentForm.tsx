import { useState, useEffect } from "react";
import CardDetailsForm from "./CardDetailsForm";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import {
  PaymentFormFields,
  PaymentFormSchema,
} from "../../schemas/PaymentFormSchema";
import { BillingAddressData } from "../../schemas/BillingAddressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardInformation } from "../../schemas/CardSchema";
import BillingAddressForm from "./BillingAddressForm";

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

const DEFAULT_BILLING_ADDRESS: BillingAddressData = {
  country: "GB",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateProvinceRegion: "",
  county: "",
  postalCode: "",
};

const DEFAULT_CARD_DETAILS: CardInformation = {
  cardNumber: "",
  expiration: "",
  cvv: "",
  holderName: "",
};

const DEFAULT_PAYMENT_FORM_VALUES: PaymentFormFields = {
  ...DEFAULT_CARD_DETAILS,
  ...DEFAULT_BILLING_ADDRESS,
};

const PaymentForm: React.FC<PaymentFormProps> = () => {
  const methods = useForm<PaymentFormFields>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: DEFAULT_PAYMENT_FORM_VALUES,
  });

  const {
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const subscription = watch((data) => {
      console.log(data);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  console.log(errors);

  const onSubmit: SubmitHandler<PaymentFormFields> = (data) => {
    console.log("Submitting payment data... ", data);
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethodValue | undefined
  >("DEBIT");

  const updatePaymentMethod = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    // if (value !== selectedPaymentMethod) {
    //   reset();
    // }
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {selectedPaymentMethod === "DEBIT" && (
            <>
              <CardDetailsForm />
              <BillingAddressForm />
            </>
          )}
          <button type="submit">Continue</button>
        </form>
      </FormProvider>
    </>
  );
};

export default PaymentForm;
