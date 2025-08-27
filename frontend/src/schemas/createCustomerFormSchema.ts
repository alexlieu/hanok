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
        .max(50)
        .transform((val) => val.replace(/\s+/g, " ")),
      email: z
        .email({ error: "Please provide a valid email address." })
        .optional()
        .or(z.literal("")),
      phoneNumber: PhoneSchema.nullable(),
      pickupDate: z
        .instanceof(CalendarDate, { message: "Please enter a valid date." })
        .optional()
        .nullable(),
      updatePreference: z.optional(z.array(z.enum(["sms", "email"]))),
      specialInstructions: z.optional(
        z
          .string()
          .max(500, { error: "You've exceeded the character limit of 500." })
      ),
      contact: z.string().optional(),
    })
    .superRefine(
      ({ fullName, pickupDate, email, phoneNumber, updatePreference }, ctx) => {
        if (fullName.length < 2) {
          ctx.addIssue({
            code: "custom",
            message: "Please provide your full name",
            path: ["fullName"],
          });
        }

        if (phoneNumber && !PhoneSchema.safeParse(phoneNumber).success) {
          ctx.addIssue({
            code: "custom",
            message: "Please provide a valid phone number.",
            path: ["phoneNumber"],
          });
        }

        if (!pickupDate) {
          ctx.addIssue({
            code: "custom",
            message: "Please enter a valid date.",
            path: ["pickupDate"],
          });
        } else {
          if (isHoliday(pickupDate)) {
            ctx.addIssue({
              code: "custom",
              message:
                "Sorry, we are closed on that day. Please choose another date.",
              path: ["pickupDate"],
            });
          }
          const { start, end } = validDateRange;
          if (pickupDate.compare(start) < 0 || pickupDate.compare(end) > 0) {
            ctx.addIssue({
              code: "custom",
              message:
                "Sorry, this pickup date is unavailable. Please choose another date within the allowed range.",
              path: ["pickupDate"],
            });
          }
        }

        if (!updatePreference || updatePreference.length < 1) {
          ctx.addIssue({
            code: "custom",
            message: "Please select at least one update preference.",
            path: ["updatePreference"],
          });
        }

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
          updatePreference?.includes("email") &&
          !hasEmail &&
          updatePreference?.includes("sms") &&
          !hasPhoneNumber
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              "Please provide an email and a phone number to receive both email and SMS updates.",
            path: ["updatePreference"],
          });
        }

        if (updatePreference?.includes("email") && !hasEmail) {
          ctx.addIssue({
            code: "custom",
            message: "Please provide an email to receive email updates.",
            path: ["updatePreference"],
          });
        }

        if (updatePreference?.includes("sms") && !hasPhoneNumber) {
          ctx.addIssue({
            code: "custom",
            message: "Please provide a phone number to receive SMS updates.",
            path: ["updatePreference"],
          });
        }
      }
    );
  const keys = schema.keyof();
  return { schema, keys };
};

export default createCustomerFormSchema;
