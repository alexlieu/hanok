import { Navigate, useLoaderData } from "react-router-dom";
// import { BasketResponse } from "../types/BasketTypes";
import OrderSummary from "../components/checkout/OrderSummary";
import PickupMap from "../components/checkout/PickupMap";
import CheckoutForm from "../components/checkout/CheckoutForm";
import { useMediaQuery } from "../utils/hooks/useWindowDimensions";
import { AccordianItem } from "../components/ui/AccordianItem";
import { useState, useMemo } from "react";
import { CheckoutRequiredData } from "../types/CheckoutType";
import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "../components/ui/aria/Disclosure";
import { TextArea } from "../components/ui/aria/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  FormProvider,
  Resolver,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  Controller,
} from "react-hook-form";
import {
  CheckoutFormValues,
  createCheckoutSchema,
} from "../schemas/CheckoutSchema";
import {
  BillingAddressData,
  DEFAULT_COUNTRY_CODE,
} from "../schemas/BillingAddressSchema";
import { CardInformation } from "../schemas/CardSchema";
import { PaymentMethod } from "../schemas/CustomerFormSchema";

const DEFAULT_CUSTOMER_DETAILS = {
  fullName: "",
  email: "",
  phoneNumber: { countryCode: DEFAULT_COUNTRY_CODE, phoneNumber: "" },
  updatePreference: [],
  pickupDate: null,
  specialInstructions: "",
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

const CheckoutPage: React.FC = () => {
  const {
    basketContent: { items, total },
    pickupRules: { firstValidDate, lastValidDate, isHoliday },
    validStatesProvincesRegions,
  } = useLoaderData() as CheckoutRequiredData;

  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const schema = useMemo(() => {
    return createCheckoutSchema(
      isHoliday,
      { start: firstValidDate, end: lastValidDate },
      validStatesProvincesRegions
    );
  }, [isHoliday, firstValidDate, lastValidDate, validStatesProvincesRegions]);

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<CheckoutFormValues>,
    mode: "onTouched",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: DEFAULT_CHECKOUT_FORM_VALUES,
  });

  const { handleSubmit, control } = methods;

  if (items.length <= 0 && total <= 0) {
    return <Navigate to="/basket" />;
  }

  const openOrderSummary = () => {
    setOrderSummaryExpanded((prevVal) => !prevVal);
  };

  const onSubmit: SubmitHandler<CheckoutFormValues> = (
    data: CheckoutFormValues
  ) => {
    console.log("Form has no validation errors:", data);
    alert("Form has no validation errors!");
  };

  const onError: SubmitErrorHandler<CheckoutFormValues> = (
    errors: FieldErrors<CheckoutFormValues>
  ) => {
    console.log("Form has validation errors:", errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="flex flex-col md:flex-row max-w-[70em] m-auto justify-center items-center md:items-start">
          <div className="w-full order-2 md:order-1 md:w-4/7 py-7 self-start">
            <CheckoutForm />
          </div>
          {isSmallScreen ? (
            <AccordianItem
              title="Order Summary"
              isExpanded={orderSummaryExpanded}
              onToggle={() => openOrderSummary()}
              containerStyle="w-full px-10 font-medium pt-7"
              buttonStyle="tracking-wide text-xl"
            >
              <div className="flex flex-col sm:flex-row sm:gap-3 md:flex-col">
                <PickupMap />
                <OrderSummary items={items} total={total} />
              </div>
            </AccordianItem>
          ) : (
            <div className="w-[85%] order-1 md:order-2 md:w-3/7 p-7 flex flex-col items-center min-w-[270px] md:sticky md:top-0">
              <PickupMap />
              <Disclosure className={`py-4 w-full`}>
                <DisclosureHeader>Add special instructions</DisclosureHeader>
                <DisclosurePanel>
                  <Controller
                    name="specialInstructions"
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, error },
                    }) => (
                      <TextArea
                        inputRef={ref}
                        value={value || ""}
                        onChange={onChange}
                        onBlur={onBlur}
                        aria-label="Special instructions"
                        className={`w-full`}
                        description="Please feel free to add any additional requests or requirements you may need for your order and we'll do our best to accommodate."
                        errorMessage={error?.message}
                        isInvalid={invalid}
                      />
                    )}
                  />
                </DisclosurePanel>
              </Disclosure>
              <OrderSummary items={items} total={total} />
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default CheckoutPage;
