import { useEffect } from "react";
import CardDetailsForm from "./CardDetailsForm";
import { useForm, Form, FormProvider } from "react-hook-form";
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
    formState: { errors },
  } = methods;

  useEffect(() => {
    const subscription = watch((data) => {
      console.log(data);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  console.log(errors);

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
