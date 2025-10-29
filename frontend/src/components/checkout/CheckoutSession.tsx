import { useMemo, useState } from "react";
import {
  CheckoutFormValues,
  createCheckoutSchema,
} from "../../schemas/CheckoutSchema";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  Resolver,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  FieldErrors,
} from "react-hook-form";
import { CardInformation } from "../../schemas/CardSchema";
import { PaymentMethod } from "../../schemas/CustomerFormSchema";
import { BillingAddressData } from "../../schemas/BillingAddressSchema";
import { DEFAULT_COUNTRY_CODE } from "../../schemas/BillingAddressSchema";
import OrderSummary from "./OrderSummary";
import { Form } from "react-aria-components";
import CheckoutForm from "./CheckoutForm";
import { twMerge } from "tailwind-merge";
import { CodedError, OrderRequest } from "../../types/order.types";
import { PaymentMethod as ApiPaymentMethod } from "../../types/order.types";
import { createOrder } from "../../services/order.service";
import {
  ApiError,
  isCodedBackendError,
  isValidationBackendError,
  transformValidationBackendErrors,
} from "../../utils/api/apiClient";
import { ServerErrorProvider } from "../../contexts/ServerErrorProvider";
import { ServerErrorState } from "../../contexts/ServerErrorContext";

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

interface CheckoutSessionProps {
  checkoutData: CheckoutRequiredData;
}

export const CheckoutSession = ({ checkoutData }: CheckoutSessionProps) => {
  const {
    basketContent: { items, total },
    pickupRules: { firstValidDate, lastValidDate, unavailableDates },
    validStatesProvincesRegions,
  } = checkoutData;

  const schema = useMemo(() => {
    return createCheckoutSchema(
      unavailableDates,
      { start: firstValidDate, end: lastValidDate },
      validStatesProvincesRegions
    );
  }, [
    firstValidDate,
    lastValidDate,
    unavailableDates,
    validStatesProvincesRegions,
  ]);

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<CheckoutFormValues>,
    mode: "onTouched",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: DEFAULT_CHECKOUT_FORM_VALUES,
  });

  const { handleSubmit } = methods;

  const [serverErrors, setServerErrors] = useState<ServerErrorState>({
    validationErrors: {},
    codedError: null,
  });

  const clearServerErrors = () => {
    setServerErrors({
      validationErrors: {},
      codedError: null,
    });
  };

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (
    data: CheckoutFormValues
  ) => {
    const payload: OrderRequest = {
      fullName: data.fullName,
      email: data.email || undefined,
      phoneNumber: data.phoneNumber?.phoneNumber || undefined,
      specialInstructions: data.specialInstructions || undefined,
      pickupDate: data.pickupDate!.toString(),
      orderItems: items.map((item) => ({
        productVariantId: item.variantId,
        quantity: item.quantity,
        notes: undefined, // TODO: Add notes to the order item
      })),
      payment: {
        total: total,
        paymentMethod: data.paymentMethod.toUpperCase() as ApiPaymentMethod,
        cardDetails:
          data.paymentMethod === "card"
            ? {
                cardNumber: data.cardNumber!,
                holderName: data.holderName!,
                expiration: data.expiration!,
                cvv: data.cvv!,
                billingAddress: {
                  addressLine1: data.addressLine1!,
                  addressLine2: data.addressLine2 || undefined,
                  city: data.city!,
                  stateProvinceRegion: data.stateProvinceRegion || undefined,
                  county: data.county || undefined,
                  postalCode: data.postalCode!,
                  country: data.country!,
                },
              }
            : undefined,
      },
    };
    try {
      if (
        payload.payment.paymentMethod !== "CARD" &&
        payload.payment.paymentMethod !== "CASH"
      ) {
        payload.payment.paymentToken = `tok_test_${payload.payment.paymentMethod.toLowerCase()}_pay_success`;
      }
      const response = await createOrder(
        payload,
        payload.payment.paymentMethod
      );
      console.log("Order created successfully: ", response);
      clearServerErrors();
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(error);
        if (isValidationBackendError(error.data)) {
          const transformedErrors = transformValidationBackendErrors(
            error.data.validationErrors
          );
          setServerErrors((prev) => ({
            ...prev,
            validationErrors: transformedErrors,
          }));
          console.log("Server errors: ", transformedErrors);
        }
        if (isCodedBackendError(error.data)) {
          setServerErrors((prev) => ({
            ...prev,
            codedError: error.data as CodedError,
          }));
          console.log("Coded error: ", error.data);
        }
      }
    }
  };

  const onError: SubmitErrorHandler<CheckoutFormValues> = (
    errors: FieldErrors<CheckoutFormValues>
  ) => {
    console.log("Form has validation errors:", errors);
  };

  return (
    <ServerErrorProvider value={serverErrors}>
      <FormProvider {...methods}>
        <div
          className={twMerge(
            "order-1 lg:order-2 md:sticky md:top-32 md:self-start md:justify-start md:flex-2/5",
            "rounded-sm shadow-sm border border-gray-200 p-6 space-y-[1.3rem]"
          )}
        >
          <OrderSummary items={items} total={total} />
        </div>
        <div className="order-2 lg:order-1 lg:flex-3/5">
          <Form
            id="checkout-form"
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-8"
            validationBehavior="aria"
          >
            <CheckoutForm />
          </Form>
        </div>
      </FormProvider>
    </ServerErrorProvider>
  );
};
