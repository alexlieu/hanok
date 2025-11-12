import { z } from "zod/v4";

import createCustomerFormSchema from "./CustomerFormSchema";
import { createPaymentFormSchema } from "./PaymentFormSchema";
import { ValidStatesProvincesRegions } from "../types/ValidStatesProvincesRegions";
import { DateRange } from "../types/DateTypes";
import { OpeningHour } from "../types/ConfigTypes";
import { PickupSlot } from "../types/ConfigTypes";

export const createCheckoutSchema = (
  unavailableDates: DateRange[],
  validDateRange: DateRange,
  validStatesProvincesRegions: ValidStatesProvincesRegions,
  pickupSlots: PickupSlot[],
  openingHours: OpeningHour[]
) => {
  const customerSchema = createCustomerFormSchema(
    unavailableDates,
    validDateRange,
    pickupSlots,
    openingHours
  );
  const { conditional: conditionalPaymentSchema } = createPaymentFormSchema(
    validStatesProvincesRegions
  );

  return customerSchema.and(conditionalPaymentSchema);
};

export type CheckoutSchemaType = ReturnType<typeof createCheckoutSchema>;
export type CheckoutFormValues = z.infer<CheckoutSchemaType>;
