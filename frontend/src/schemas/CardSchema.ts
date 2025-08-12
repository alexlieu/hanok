import { z } from "zod/v4";

export const CardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^(\d{4}\s){3}\d{4}$/, "Card number must be 16 digits."),
  expiration: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format.")
    .refine(
      (val) => {
        const [month2Digit, year2Digit] = val.split("/");
        const month = parseInt(month2Digit, 10);
        const year = parseInt(year2Digit, 10);
        if (month < 1 || month > 12) return false;
        const getFullYear = (year: number) => {
          return year >= 40
            ? parseInt(`19${year2Digit}`)
            : parseInt(`20${year2Digit}`);
        };
        const fullYear = getFullYear(year);
        const expirationDate = new Date(fullYear, month - 1);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (expirationDate < currentDate) return false;

        return true;
      },
      { message: "Expiration date is invalid or in the past." }
    ),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  holderName: z.string().min(1, "Holder name is required"),
});

export type CardInformation = z.infer<typeof CardSchema>;
