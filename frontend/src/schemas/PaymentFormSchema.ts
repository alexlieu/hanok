import { z } from "zod/v4";
import { CardSchema } from "./CardSchema";
import { createBillingAddressSchema } from "./BillingAddressSchema";
import { ValidStatesProvincesRegions } from "../types/ValidStatesProvincesRegions";

export const createPaymentFormSchema = (
  validStatesProvincesRegions: ValidStatesProvincesRegions
) => {
  return CardSchema.and(
    createBillingAddressSchema(validStatesProvincesRegions)
  );
};

export type DynamicPaymentFormFields = ReturnType<
  typeof createPaymentFormSchema
>;
export type PaymentFormData = z.infer<DynamicPaymentFormFields>;
