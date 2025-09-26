import { z } from "zod/v4";

import createCustomerFormSchema from "./CustomerFormSchema";
import { createPaymentFormSchema } from "./PaymentFormSchema";
import { CalendarDate, DateValue } from "@internationalized/date";
import { ValidStatesProvincesRegions } from "../types/ValidStatesProvincesRegions";

export const createCheckoutSchema = (
  isHoliday: (pickupDate: DateValue) => boolean,
  validDateRange: { start: CalendarDate; end: CalendarDate },
  validStatesProvincesRegions: ValidStatesProvincesRegions
) => {
  const customerSchema = createCustomerFormSchema(isHoliday, validDateRange);
  const paymentSchema = createPaymentFormSchema(validStatesProvincesRegions);
  return customerSchema.and(paymentSchema);
};

export type CheckoutSchemaType = ReturnType<typeof createCheckoutSchema>;
export type CheckoutFormValues = z.infer<CheckoutSchemaType>;
