import { useEffect, useMemo, useImperativeHandle } from "react";
import CardDetailsForm from "./CardDetailsForm";
import { useForm, Form, FormProvider, SubmitHandler } from "react-hook-form";
import {
  createPaymentFormSchema,
  PaymentFormData,
} from "../../schemas/PaymentFormSchema";
import { BillingAddressData } from "../../schemas/BillingAddressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardInformation } from "../../schemas/CardSchema";
import {
  Disclosure,
  DisclosureGroup,
  DisclosureHeader,
  DisclosurePanel,
} from "../ui/aria/Disclosure";
import { Button } from "../ui/aria/Button";
import BillingAddressForm from "./BillingAddressForm";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";

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

// const isPaymentMethod = (value: string): value is PaymentMethodValue => {
//   return PAYMENT_METHODS.some((method) => method.value === value);
// };

interface PaymentFormProps {
  controlledSubmit?: boolean;
  onSubmissionComplete?: () => void;
  ref?: React.Ref<PaymentFormRef>;
}

export interface PaymentFormRef {
  getValues: () => PaymentFormData;
  triggerSubmit: () => Promise<boolean>;
  reset: () => void;
}

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

const DEFAULT_PAYMENT_FORM_VALUES: PaymentFormData = {
  ...DEFAULT_CARD_DETAILS,
  ...DEFAULT_BILLING_ADDRESS,
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  controlledSubmit,
  onSubmissionComplete,
  ref,
}) => {
  const { validStatesProvincesRegions } =
    useLoaderData() as CheckoutRequiredData;

  const schema = useMemo(() => {
    return createPaymentFormSchema(validStatesProvincesRegions);
  }, [validStatesProvincesRegions]);

  const methods = useForm<PaymentFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: DEFAULT_PAYMENT_FORM_VALUES,
    shouldFocusError: false,
  });

  const {
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = methods;

  // Expose methods to parent component
  useImperativeHandle(
    ref,
    () => ({
      getValues: () => getValues(),
      triggerSubmit: () => {
        return new Promise<boolean>((resolve) => {
          handleSubmit(
            () => resolve(true),
            () => resolve(false)
          )();
        });
      },
      reset: () => reset(),
    }),
    [getValues, handleSubmit, reset]
  );

  useEffect(() => {
    const subscription = watch((data) => {
      console.log(data);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  console.log("error:", errors);

  const onSubmit: SubmitHandler<PaymentFormData> = (data: PaymentFormData) => {
    console.log(data);
  };

  useEffect(() => {
    if (controlledSubmit) {
      handleSubmit(onSubmit)();
      onSubmissionComplete?.();
    }
  }, [controlledSubmit, handleSubmit, onSubmissionComplete]);

  return (
    <FormProvider {...methods}>
      <Form onSubmit={({ data }) => console.log(data)}>
        <h4 className="uppercase tracking-wide text-xl mb-2">Payment</h4>
        <div>
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
        </div>
        {controlledSubmit && (
          <Button variant="secondary" type="submit" className={"mt-7"}>
            Submit
          </Button>
        )}
      </Form>
    </FormProvider>
  );
};

export default PaymentForm;
