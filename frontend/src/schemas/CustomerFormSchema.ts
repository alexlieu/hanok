import { z } from "zod/v4";
import { CalendarDate, DayOfWeek, getDayOfWeek } from "@internationalized/date";
import { PhoneSchema } from "./PhoneSchema";
import { isDateInRanges } from "../utils/dateUtils";
import { DateRange } from "../types/DateTypes";
import { OpeningHour, PickupSlot } from "../types/ConfigTypes";

export const PAYMENT_METHODS = [
  {
    value: "card",
    label: "Card",
  },
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "paypal",
    label: "Paypal",
  },
  {
    value: "apple",
    label: "Apple Pay",
  },
  {
    value: "google",
    label: "Google Pay",
  },
  {
    value: "mobile",
    label: "Mobile Payment",
  },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

const CustomerFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Please provide your full name." })
      .max(100)
      .transform((val) => val.trim().replace(/\s+/g, " ")),
    email: z
      .email({ error: "Please provide a valid email address." })
      .optional()
      .or(z.literal("")),
    phoneNumber: PhoneSchema.nullable(),
    pickupDate: z
      .instanceof(CalendarDate, { message: "Please enter a valid date." })
      .nullish(),
    pickupSlot: z.string().nullish(),
    updatePreference: z.optional(
      z
        .array(z.enum(["sms", "email"]))
        .min(1, { message: "Please select at least one update preference." })
    ),
    specialInstructions: z.optional(
      z
        .string()
        .max(250, { error: "You've exceeded the character limit of 500." })
    ),
    contact: z.string().optional(),
    paymentMethod: z
      .enum(PAYMENT_METHODS.map((method) => method.value))
      .default("card"),
  })
  .superRefine(
    ({ pickupDate, pickupSlot, email, phoneNumber, updatePreference }, ctx) => {
      if (!pickupDate) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter a valid date.",
          path: ["pickupDate"],
        });
      }

      if (!pickupSlot) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a pickup slot.",
          path: ["pickupSlot"],
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

const createCustomerFormSchema = (
  unavailableDates: DateRange[],
  validDateRange: DateRange,
  pickupSlots: PickupSlot[],
  openingHours: OpeningHour[]
) => {
  const openingHoursMap = new Map(
    openingHours.map((hour) => [
      hour.dayOfWeek,
      { start: hour.start, end: hour.end },
    ])
  );
  return CustomerFormSchema.superRefine(({ pickupDate, pickupSlot }, ctx) => {
    if (pickupDate) {
      if (isDateInRanges(pickupDate, unavailableDates)) {
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
    if (pickupSlot && !pickupSlots.some((slot) => slot.value === pickupSlot)) {
      ctx.addIssue({
        code: "custom",
        message: "Please select a valid pickup slot.",
        path: ["pickupSlot"],
      });
    }
    const selectedDayOpeningHours = pickupDate
      ? openingHoursMap.get(
          getDayOfWeek(pickupDate, "en-GB") as unknown as DayOfWeek
        )
      : undefined;
    const unavailablePickupSlots = selectedDayOpeningHours
      ? pickupSlots.filter(
          (slot) =>
            slot.end.compare(selectedDayOpeningHours.end) >= 0 ||
            slot.start.compare(selectedDayOpeningHours.start) <= 0
        )
      : [];
    if (pickupDate && pickupSlot && !selectedDayOpeningHours) {
      ctx.addIssue({
        code: "custom",
        message:
          "Sorry, we don't have opening hours for that day. Please choose another date.",
        path: ["pickupSlot"],
      });
      return;
    }
    if (unavailablePickupSlots.some((slot) => slot.value === pickupSlot)) {
      ctx.addIssue({
        code: "custom",
        message: "Please select a valid pickup slot.",
        path: ["pickupSlot"],
      });
    }
  });
};

export default createCustomerFormSchema;
