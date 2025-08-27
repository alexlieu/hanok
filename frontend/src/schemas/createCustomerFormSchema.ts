import { z } from "zod/v4";
import { CalendarDate } from "@internationalized/date";
import { DateValue } from "react-aria-components";
import { PhoneSchema } from "./PhoneSchema";

const createCustomerFormSchema = (
  isHoliday: (pickupDate: DateValue) => boolean,
  validDateRange: { start: CalendarDate; end: CalendarDate }
) => {
  const schema = z
    .object({
      fullName: z
        .string()
        .transform((val) => val.replace(/\s+/g, " "))
        .pipe(
          z
            .string()
            .min(2, { message: "Please provide your full name." })
            .max(50)
        ),
      email: z
        .email({ error: "Please provide a valid email address." })
        .optional()
        .or(z.literal("")),
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
      pickupDate: z
        .instanceof(CalendarDate, { message: "Please enter a valid date." })
        .refine((d) => !isHoliday(d), {
          message:
            "Sorry, we are closed on that day. Please choose another date.",
        })
        .refine(
          (d) => {
            const { start, end } = validDateRange;
            if (d.compare(start) >= 0 && d.compare(end) <= 0) return true;
          },
          {
            message:
              "Sorry, this pickup date is unavailable. Please choose another date within the allowed range.",
          }
        ),
      updatePreference: z
        .array(z.enum(["sms", "email"]), {
          message: "Please select at least one update preference.",
        })
        .min(1, "Please select at least one update preference."),
      specialInstructions: z.optional(
        z
          .string()
          .max(500, { error: "You've exceeded the character limit of 500." })
      ),
      contact: z.string().optional(),
    })
    .superRefine(({ email, phoneNumber, updatePreference }, ctx) => {
      const hasEmail = email && email.trim().length !== 0;
      const hasPhoneNumber =
        phoneNumber?.phoneNumber &&
        phoneNumber?.phoneNumber.trim().length !== 0;

      if (!hasEmail && !hasPhoneNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Please provide either your email or phone number.",
          path: ["contact"],
        });
      }

      if (
        updatePreference.includes("email") &&
        !hasEmail &&
        updatePreference.includes("sms") &&
        !hasPhoneNumber
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Please provide an email and a phone number to receive both email and SMS updates.",
          path: ["updatePreference"],
        });
      }

      if (updatePreference.includes("email") && !hasEmail) {
        ctx.addIssue({
          code: "custom",
          message: "Please provide an email to receive email updates.",
          path: ["updatePreference"],
        });
      }

      if (updatePreference.includes("sms") && !hasPhoneNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Please provide a phone number to receive SMS updates.",
          path: ["updatePreference"],
        });
      }
    });
  const keys = schema.keyof();
  return { schema, keys };
};

export default createCustomerFormSchema;
