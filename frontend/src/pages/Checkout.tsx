import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
import OrderSummary from "../components/checkout/OrderSummary";
import CheckoutForm from "../components/checkout/CheckoutForm";
import { useMediaQuery } from "../utils/hooks/useWindowDimensions";
import { useMemo } from "react";
import { CheckoutRequiredData } from "../types/CheckoutType";
import { formatPrice } from "../utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  FormProvider,
  Resolver,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Form } from "react-aria-components";
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
import { Button } from "../components/ui/aria/Button";
import { FaChevronLeft } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";

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
  const navigate = useNavigate();
  const {
    basketContent: { items, total },
    pickupRules: { firstValidDate, lastValidDate, isHoliday },
    validStatesProvincesRegions,
  } = useLoaderData() as CheckoutRequiredData;

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

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  console.log(errors);

  const paymentMethod = watch("paymentMethod");

  if (items.length <= 0 && total <= 0) {
    return <Navigate to="/basket" />;
  }

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
      <div className="min-h-screen flex justify-center">
        <div className="w-[80%] max-w-5xl">
          <div className="sticky top-0 z-10 bg-default-bg">
            <div className="mx-auto">
              <div className="flex items-center justify-between h-[4.5rem] relative">
                <Button
                  className="flex gap-1 text-[0.8rem] group"
                  variant="icon"
                  onClick={() => navigate("/basket")}
                >
                  <FaChevronLeft
                    size="0.8rem"
                    className="group-hover:translate-x-[-0.15rem] delay-150 ease-out transition-transform"
                  />
                  <span>back to basket</span>
                </Button>
                <h1 className="text-3xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  checkout
                </h1>
              </div>
            </div>
          </div>
          <div className={`${isSmallScreen ? "space-y-6" : "flex gap-[4rem]"}`}>
            <div
              className={`
                ${
                  isSmallScreen
                    ? "order-1"
                    : "lg:order-2 lg:sticky lg:top-32 lg:self-start lg:justify-start lg:flex-2/5"
                }`}
            >
              <div className="rounded-sm shadow-sm border border-gray-200 p-6 space-y-[1.3rem]">
                <h2 className="lowercase text-lg font-semibold mb-4">
                  order summary
                </h2>
                <OrderSummary items={items} />
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-lg font-semibold px-2">
                    <span>total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  type="submit"
                  form="checkout-form"
                  className="w-full"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={paymentMethod}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {paymentMethod !== "card"
                        ? `Pay with ${paymentMethod}`
                        : "Place Order"}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </div>
            </div>

            <div
              className={`${
                isSmallScreen ? "order-2" : "lg:order-1 lg:flex-3/5"
              }`}
            >
              <Form
                id="checkout-form"
                onSubmit={handleSubmit(onSubmit, onError)}
                className="space-y-8"
                validationBehavior="aria"
              >
                <CheckoutForm />
                <Button type="submit">Place Order</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CheckoutPage;
