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
        .instanceof(CalendarDate, { message: "Invalid date value" })
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
      smsUpdate: z.boolean().optional(),
      emailUpdate: z.boolean().optional(),
      specialInstructions: z
        .string()
        .max(500, { error: "You've exceeded the character limit of 500." })
        .nullable(),
      contact: z.string().optional(),
      update: z.string().optional(),
    })
    .refine(
      (data) => {
        const { email, phoneNumber } = data;
        return (
          (email && email.trim() !== "") ||
          (phoneNumber !== undefined &&
            phoneNumber?.phoneNumber !== undefined &&
            phoneNumber?.phoneNumber.trim() !== "")
        );
      },
      {
        message: "Please provide either your email or phone number.",
        path: ["contact"],
      }
    )
    .refine(({ smsUpdate, emailUpdate }) => smsUpdate || emailUpdate, {
      message:
        "Please select your preferred method for receiving your order updates.",
      path: ["update"],
    });
  const keys = schema.keyof();
  return { schema, keys };
};

export default createCustomerFormSchema;
