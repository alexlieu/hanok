import PaymentForm from "./PaymentForm";
import CustomerForm from "./CustomerForm";
import { Button } from "../ui/aria/Button";
import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  FormProvider,
  Resolver,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  CheckoutFormValues,
  createCheckoutSchema,
} from "../../schemas/CheckoutSchema";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import {
  BillingAddressData,
  DEFAULT_COUNTRY_CODE,
} from "../../schemas/BillingAddressSchema";
import { CardInformation } from "../../schemas/CardSchema";
import { PaymentMethod } from "../../schemas/CustomerFormSchema";

const DEFAULT_CUSTOMER_DETAILS = {
  fullName: "",
  email: "",
  phoneNumber: { countryCode: DEFAULT_COUNTRY_CODE, phoneNumber: "" },
  updatePreference: [],
  pickupDate: null,
  specialInstructions: undefined,
  paymentMethod: "card" as PaymentMethod,
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

const DEFAULT_CHECKOUT_FORM_VALUES: CheckoutFormValues = {
  ...DEFAULT_CUSTOMER_DETAILS,
  ...DEFAULT_BILLING_ADDRESS,
  ...DEFAULT_CARD_DETAILS,
};

const CheckoutForm: React.FC = () => {
  const {
    pickupRules: { firstValidDate, lastValidDate, isHoliday },
    validStatesProvincesRegions,
  } = useLoaderData() as CheckoutRequiredData;

  const schema = useMemo(() => {
    return createCheckoutSchema(
      isHoliday,
      { start: firstValidDate, end: lastValidDate },
      validStatesProvincesRegions
    );
  }, [isHoliday, firstValidDate, lastValidDate, validStatesProvincesRegions]);

  const methods = useForm<CheckoutFormValues>({
    // A problem arises when the schema is passed to useForm
    // useForm uses a generic type TFieldValues that it uses for validation.
    // Sometimes with the way types are inferred and passed, the expected type can become slightly more general
    // e.g. {countryCode: string}
    // So we cast the resolver to match the FormData type
    // We cast to unknown first as this is the safest way to perform a type assertion that breaks the direct type compatibility check.
    resolver: zodResolver(schema) as unknown as Resolver<CheckoutFormValues>,
    mode: "onTouched",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: DEFAULT_CHECKOUT_FORM_VALUES,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  console.log("error:", errors);

  const onSubmit: SubmitHandler<CheckoutFormValues> = (
    data: CheckoutFormValues
  ) => {
    console.log("Form has not validation errors:", data);
    alert("Form has not validation errors!");
  };

  const onError: SubmitErrorHandler<CheckoutFormValues> = (
    errors: FieldErrors<CheckoutFormValues>
  ) => {
    console.log("Form has validation errors:", errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="mx-auto px-10">
          <CustomerForm />
          <PaymentForm />
          <div className="relative inline-block">
            <Button variant="secondary" type="submit">
              Place Order
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CheckoutForm;
