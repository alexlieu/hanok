import {
  BillingAddressData,
  DEFAULT_COUNTRY_CODE,
} from "../schemas/BillingAddressSchema";
import { CardInformation } from "../schemas/CardSchema";
import { CheckoutFormValues } from "../schemas/CheckoutSchema";
import { PaymentMethod } from "../schemas/CustomerFormSchema";
import { CalendarDate } from "@internationalized/date";

export const TEST_CUSTOMER_DETAILS = {
  fullName: "John Doe",
  email: "john.doe@gmail.com",
  phoneNumber: { countryCode: DEFAULT_COUNTRY_CODE, phoneNumber: "" },
  updatePreference: ["email"],
  pickupDate: new CalendarDate(2025, 12, 10),
  pickupSlot: "SLOT_1",
  specialInstructions: "",
  paymentMethod: "card" as PaymentMethod,
};

export const TEST_BILLING_ADDRESS: BillingAddressData = {
  country: "GB",
  addressLine1: "123 Main St",
  addressLine2: "",
  city: "London",
  stateProvinceRegion: "",
  county: "London",
  postalCode: "SW11 8JS",
};

export const TEST_CARD_DETAILS: CardInformation = {
  cardNumber: "4000 0566 5566 5556",
  expiration: "12/27",
  cvv: "1234",
  holderName: "John Doe",
};

export const TEST_CHECKOUT_FORM_VALUES = {
  ...TEST_CUSTOMER_DETAILS,
  ...TEST_BILLING_ADDRESS,
  ...TEST_CARD_DETAILS,
} as CheckoutFormValues;
