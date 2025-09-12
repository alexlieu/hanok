import { z } from "zod/v4";

function luhnAlgorithm(cardNo: string) {
  if (/^[0-9]*$/.test(cardNo.replace(/\D/g, "")) === false) return false;
  const checkDigit = Number(cardNo[cardNo.length - 1]);
  const payload = cardNo.substring(0, cardNo.length - 1).replace(/\D/g, "");
  const digitsReversed = payload.split("").reverse();
  let sum: number = 0;
  for (let step = 0; step < digitsReversed.length; step++) {
    if (step % 2 === 0) {
      const doubleDigit = Number(digitsReversed[step]) * 2;
      sum += doubleDigit > 9 ? doubleDigit - 9 : doubleDigit;
    } else {
      sum += Number(digitsReversed[step]);
    }
  }
  const totalSum = sum + checkDigit;
  return totalSum % 10 === 0;
}

export function getIssuingBank(cardNo: string) {
  if (cardNo.match(new RegExp("^4")) !== null) return "Visa";
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(cardNo))
    return "Mastercard";
  if (cardNo.match("^3[47]") !== null) return "Amex";
  return;
}

export type issuingBank = ReturnType<typeof getIssuingBank>;
export type filteredIssuingBank = Exclude<issuingBank, undefined>;

function validateBIN(cardNo: string) {
  const cardLength = cardNo.replace(/\D/g, "").length;
  const issuingBank = getIssuingBank(cardNo);
  // if (issuingBank === "Visa" && ![13, 16, 19].includes(cardLength)) {
  //   return false;
  // }
  if (
    (issuingBank === "Mastercard" || issuingBank === "Visa") &&
    cardLength !== 16
  ) {
    return false;
  }
  if (issuingBank === "Amex" && cardLength !== 15) {
    return false;
  }
  if (issuingBank === undefined) {
    return false;
  }
  return true;
}

export const CardSchema = z.object({
  cardNumber: z.string().refine(
    (val) => {
      return validateBIN(val) && luhnAlgorithm(val);
    },
    { message: "Your card number is invalid." }
  ),
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
