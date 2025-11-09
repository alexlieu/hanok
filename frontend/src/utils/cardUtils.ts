import { issuingBank } from "../schemas/CardSchema";

export const allLogos = ["Visa", "Mastercard", "Amex"];

export function getActiveCards(bank: issuingBank): string[] {
  return bank === undefined
    ? allLogos
    : allLogos.filter((logo) => logo === bank);
}
