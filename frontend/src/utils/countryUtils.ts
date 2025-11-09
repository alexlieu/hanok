import { COUNTRY_CODES } from "../schemas/BillingAddressSchema";

export const checkIsCountry = (
  selectedCountry: (typeof COUNTRY_CODES)[number],
  countries: (typeof COUNTRY_CODES)[number][]
) => {
  return countries.includes(selectedCountry);
};
