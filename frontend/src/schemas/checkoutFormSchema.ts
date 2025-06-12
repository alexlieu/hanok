import { z } from "zod/v4";
import { validatePhoneNumber } from "../validator/PhoneNumberValidator";
import { isPickupValid } from "../validator/PickupDateValidator";

export const CheckoutSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.email().trim().optional().or(z.literal("")),
    phoneNumber: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => validatePhoneNumber(val), {
        error: "Invalid phone number.",
      }),
    pickup: z.iso
      .datetime("Please select your preferred pickup date.")
      .refine((val) => isPickupValid(val), { error: "Invalid pickup date." }),
    smsUpdate: z.boolean().optional(),
    emailUpdate: z.boolean().optional(),
    specialInstructions: z.string().nullable(),
    contactMethod: z.string().optional(),
    updateChoice: z.nullish(z.string()),
  })
  .check((ctx) => {
    if (!ctx.value.email && !ctx.value.phoneNumber) {
      ctx.issues.push({
        code: "custom",
        message: "Please provide one method of contact.",
        path: ["contactMethod"],
        input: ctx.value,
      });
    }
    if (!ctx.value.emailUpdate && !ctx.value.smsUpdate) {
      ctx.issues.push({
        code: "custom",
        message: "Please select your preferred method of contact",
        path: ["updateChoice"],
        input: ctx.value,
      });
    }
  });

export const formKeySchema = CheckoutSchema.keyof();
export type FormData = z.infer<typeof CheckoutSchema>;
