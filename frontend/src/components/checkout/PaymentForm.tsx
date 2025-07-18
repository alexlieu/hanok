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
import { AccordianRadioItem } from "../ui/AccordianItem";
import ExpressCheckout from "./ExpressCheckout";

const PAYMENT_METHODS = [
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

// const isPaymentMethod = (value: string): value is PaymentMethodValue => {
//   return PAYMENT_METHODS.some((method) => method.value === value);
// };

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

const PaymentForm: React.FC = () => {
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

  // const updatePaymentMethod = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   const value = event.currentTarget.value;
  //   // if (value !== selectedPaymentMethod) {
  //   //   reset();
  //   // }
  //   if (isPaymentMethod(value)) {
  //     setSelectedPaymentMethod((prevState) =>
  //       prevState === value ? undefined : value
  //     );
  //   } else {
  //     console.log("Invalid payment method type: ", value);
  //   }
  // };

  const updatePaymentMethod = (value: PaymentMethodValue) => {
    setSelectedPaymentMethod((prevVal) => {
      if (prevVal !== value) {
        methods.reset(DEFAULT_PAYMENT_FORM_VALUES);
      }
      return value;
    });
  };

  return (
    <div className="mx-auto">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <fieldset>
              <legend className="text-xl font-medium tracking-wide mx-auto">
                Express checkout
              </legend>
              <ExpressCheckout />
            </fieldset>
          </div>
          <p
            className="flex items-center font-semibold tracking-wider text-xl text-gray-400 my-5 
          before:content-[''] before:flex-1 before:h-[3px] before:bg-gray-300 before:mr-2
          after:content-[''] after:flex-1 after:h-[3px] after:bg-gray-300 after:ml-2"
          >
            OR
          </p>
          <div>
            {PAYMENT_METHODS.map(({ value, label }) => (
              <AccordianRadioItem
                key={value}
                isExpanded={selectedPaymentMethod === value}
                title={label}
                onToggle={() => updatePaymentMethod(value)}
                radioName="payment-method-accordian-item"
                radioValue={value}
                isChecked={selectedPaymentMethod === value}
              >
                {value === "DEBIT" && (
                  <div className="flex flex-col w-full mx-auto">
                    <CardDetailsForm />
                    <BillingAddressForm />
                    <button type="submit" className="mx-auto w-full">
                      Continue
                    </button>
                  </div>
                )}
                {value === "PAYPAL" && (
                  <div>
                    <h3>PAYPAL</h3>
                  </div>
                )}
              </AccordianRadioItem>
            ))}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default PaymentForm;
