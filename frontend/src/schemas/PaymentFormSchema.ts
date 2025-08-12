import { z } from "zod/v4";
import { CardSchema } from "./CardSchema";
import { BillingAddressSchema } from "./BillingAddressSchema";

export const PaymentFormSchema = z.object({
  ...CardSchema.shape,
  ...BillingAddressSchema.shape,
});

export type PaymentFormFields = z.infer<typeof PaymentFormSchema>;
