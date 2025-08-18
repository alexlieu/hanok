import { z } from "zod/v4";
import { PhoneSchema } from "./PhoneSchema";

export const CheckoutSchema = z
  .object({
    fullName: z
      .string()
      .transform((val) => val.replace(/\s+/g, " "))
      .pipe(
        z.string().min(2, { message: "Please provide your full name." }).max(50)
      ),
    email: z
      .email({ error: "Please provide a valid email address." })
      .optional()
      .or(z.literal("")), // don't like behaviour of this object
    // phoneNumber: PhoneSchema.optional().refine(
    //   (val) => val === undefined || PhoneSchema.safeParse(val).success,
    //   { error: "Please provide a valid phone number." }
    // ),
    phoneNumber: PhoneSchema.nullable().check((ctx) => {
      if (!PhoneSchema.safeParse(ctx.value).success) {
        ctx.issues.push({
          code: "custom",
          message: "Please provide a valid phone number.",
          input: ctx.value,
        });
      }
      return;
    }),
    // pickup: z.iso
    //   .datetime("Please select your preferred pickup date.")
    //   .refine((val) => isPickupValid(val, 3, 3, 14, 0, "Europe/London"), {
    //     error: "Invalid pickup date.",
    //   }),
    smsUpdate: z.boolean().optional(),
    emailUpdate: z.boolean().optional(),
    specialInstructions: z.string().nullable(),
    contact: z.string().optional(),
    update: z.nullish(z.string()),
  })
  .refine(
    (data) => {
      const { email, phoneNumber } = data;

      // Check if phone number or email is filled, not strictly valid.
      return (
        (email && email.trim() !== "") ||
        (phoneNumber !== undefined &&
          phoneNumber?.phoneNumber !== undefined &&
          phoneNumber.phoneNumber.trim() !== "")
      );
    },
    {
      message: "Please provide either your email or phone number.",
      path: ["contact"],
    }
  )
  .refine(({ smsUpdate, emailUpdate }) => smsUpdate || emailUpdate, {
    message: "Please select your preferred method of contact.",
    path: ["update"],
  });

export const formKeySchema = CheckoutSchema.keyof();
export type FormData = z.infer<typeof CheckoutSchema>;
