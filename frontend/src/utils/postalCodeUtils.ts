import { COUNTRY_CODES } from "../schemas/BillingAddressSchema";
import { checkIsCountry } from "./countryUtils";

/**
 * Cleans and formats postal codes based on the selected country
 * @param input - The raw postal code input
 * @param selectedCountry - The selected country code
 * @param onChange - The onChange function to call with the cleaned value
 */
export const cleanPostalCode = (
  input: string,
  selectedCountry: (typeof COUNTRY_CODES)[number],
  onChange: (value: string) => void
) => {
  let cleanedInput;

  if (checkIsCountry(selectedCountry, ["KR", "US"])) {
    cleanedInput = input.match(/[0-9]/g)?.join("");
  }
  if (checkIsCountry(selectedCountry, ["KR"])) {
    if (cleanedInput && cleanedInput.length > 5) {
      cleanedInput = cleanedInput.substring(0, 5);
    }
  }
  if (checkIsCountry(selectedCountry, ["US"])) {
    if (cleanedInput && cleanedInput.length > 5) {
      cleanedInput =
        cleanedInput.substring(0, 5) + "-" + cleanedInput.substring(5, 9);
    }
  }
  if (checkIsCountry(selectedCountry, ["CA", "GB"])) {
    cleanedInput = input.replace(/[a-z]/g, (char) => char.toUpperCase());
    cleanedInput = cleanedInput.match(/[A-Z0-9]/g)?.join("");
  }
  if (checkIsCountry(selectedCountry, ["CA"])) {
    if (cleanedInput && cleanedInput.length > 3) {
      cleanedInput =
        cleanedInput.substring(0, 3) + " " + cleanedInput.substring(3, 6);
    }
  }
  if (checkIsCountry(selectedCountry, ["GB"])) {
    if (cleanedInput && cleanedInput.length > 3) {
      if (cleanedInput.length > 6) {
        cleanedInput = cleanedInput.replace(/\s/g, "");
        cleanedInput =
          cleanedInput.substring(0, 4) + " " + cleanedInput.substring(4, 7);
      } else {
        cleanedInput =
          cleanedInput.substring(0, 3) + " " + cleanedInput.substring(3);
      }
    }
  }
  onChange(cleanedInput || "");
};

/**
 * Gets the maximum length for postal code input based on country
 * @param selectedCountry - The selected country code
 * @returns The maximum length for the postal code input
 */
export const getPostalCodeMaxLength = (
  selectedCountry: (typeof COUNTRY_CODES)[number]
): number => {
  if (checkIsCountry(selectedCountry, ["GB"])) return 8;
  if (checkIsCountry(selectedCountry, ["CA"])) return 7;
  if (checkIsCountry(selectedCountry, ["KR"])) return 5;
  return 10;
};
