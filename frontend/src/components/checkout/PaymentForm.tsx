import { useState, useEffect } from "react";
import CardDetailsForm from "./CardDetailsForm";
import { SubmitHandler, useForm, Form, FormProvider } from "react-hook-form";
import {
  PaymentFormFields,
  PaymentFormSchema,
} from "../../schemas/PaymentFormSchema";
import { BillingAddressData } from "../../schemas/BillingAddressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardInformation } from "../../schemas/CardSchema";
// import BillingAddressForm from "./BillingAddressForm";
import { AccordianRadioItem } from "../ui/AccordianItem";
import ExpressCheckout from "./ExpressCheckout";
import {
  Disclosure,
  DisclosureGroup,
  DisclosureHeader,
  DisclosurePanel,
} from "../ui/aria/Disclosure";
import { Button } from "../ui/aria/Button";

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
  >("CARD");

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

  const validCard = "1789372997";

  function luhnAlgorithm(cardNo: string) {
    if (/^\d+$/.test(cardNo) === false) return "not a number";
    const digitsReversed = cardNo.split("").reverse();
    let sumDigits: number = 0;
    for (let step = 0; step < cardNo.length; step++) {
      console.log(digitsReversed[step]);
      if (step % 2 !== 0) {
        const doubleDigit = Number(digitsReversed[step]) * 2;
        sumDigits += doubleDigit > 9 ? doubleDigit - 9 : doubleDigit;
      } else {
        sumDigits += Number(digitsReversed[step]);
      }
    }
    return sumDigits % 10 === 0 ? "passed" : "failed";
  }

  return (
    <FormProvider {...methods}>
      <Form onSubmit={({ data }) => console.log(data)}>
        <h4 className="uppercase tracking-wide text-xl mb-2">Payment</h4>
        <div>
          <DisclosureGroup
            className={"flex flex-col gap-2"}
            allowsMultipleExpanded={false}
            defaultExpandedKeys={["CARD"]}
          >
            {PAYMENT_METHODS.map(({ value, label }) => (
              <Disclosure id={value} key={value}>
                <DisclosureHeader>{label}</DisclosureHeader>
                <DisclosurePanel>
                  {value === "CARD" && (
                    <div className="flex flex-col gap-4">
                      <CardDetailsForm />
                      {/* <BillingAddressForm /> */}
                    </div>
                  )}
                </DisclosurePanel>
              </Disclosure>
            ))}
          </DisclosureGroup>
        </div>
        <Button variant="secondary" type="submit" className={"mt-7"}>
          Submit
        </Button>
      </Form>
    </FormProvider>
  );
};

export default PaymentForm;
