import { z } from "zod/v4";

import createCustomerFormSchema from "./CustomerFormSchema";
import { createPaymentFormSchema } from "./PaymentFormSchema";
import { ValidStatesProvincesRegions } from "../types/ValidStatesProvincesRegions";
import { DateRange } from "../types/DateTypes";

export const createCheckoutSchema = (
  unavailableDates: DateRange[],
  validDateRange: DateRange,
  validStatesProvincesRegions: ValidStatesProvincesRegions
) => {
  const customerSchema = createCustomerFormSchema(
    unavailableDates,
    validDateRange
  );
  const paymentSchema = createPaymentFormSchema(validStatesProvincesRegions);
  return customerSchema.and(paymentSchema);
};

export type CheckoutSchemaType = ReturnType<typeof createCheckoutSchema>;
export type CheckoutFormValues = z.infer<CheckoutSchemaType>;
