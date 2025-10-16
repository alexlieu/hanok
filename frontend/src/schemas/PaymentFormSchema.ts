import { z } from "zod/v4";
import { CardSchema } from "./CardSchema";
import { createBillingAddressSchema } from "./BillingAddressSchema";
import { ValidStatesProvincesRegions } from "../types/ValidStatesProvincesRegions";

export const createPaymentFormSchema = (
  validStatesProvincesRegions: ValidStatesProvincesRegions
) => {
  const fullCardSchema = CardSchema;
  const fullBillingAddressSchema = createBillingAddressSchema(
    validStatesProvincesRegions
  );

  // Create a schema that conditionally validates payment fields based on payment method
  // All fields are optional and allow super refine logic to handle validation when payment method is "card"
  const conditionalPaymentSchema = z
    .object({
      paymentMethod: z.string(),
      cardNumber: z.string().optional(),
      expiration: z.string().optional(),
      cvv: z.string().optional(),
      holderName: z.string().optional(),
      country: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      stateProvinceRegion: z.string().optional(),
      county: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.paymentMethod === "card") {
        const cardResult = fullCardSchema.safeParse({
          cardNumber: data.cardNumber,
          expiration: data.expiration,
          cvv: data.cvv,
          holderName: data.holderName,
        });

        if (!cardResult.success) {
          cardResult.error.issues.forEach((issue) => {
            ctx.addIssue({
              ...issue,
              path: issue.path,
            });
          });
        }

        const billingResult = fullBillingAddressSchema.safeParse({
          country: data.country,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          stateProvinceRegion: data.stateProvinceRegion,
          county: data.county,
          postalCode: data.postalCode,
        });

        if (!billingResult.success) {
          billingResult.error.issues.forEach((issue) => {
            ctx.addIssue({
              ...issue,
              path: issue.path,
            });
          });
        }
      }
    });

  return {
    full: fullCardSchema.and(fullBillingAddressSchema),
    conditional: conditionalPaymentSchema,
  };
};

export type DynamicPaymentFormFields = ReturnType<
  typeof createPaymentFormSchema
>;
export type PaymentFormData = z.infer<DynamicPaymentFormFields>;
