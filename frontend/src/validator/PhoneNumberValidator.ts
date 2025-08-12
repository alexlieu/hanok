import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";

export const validatePhoneNumber = (
  input: string | undefined | null,
  countryCode?: CountryCode
) => {
  if (!input) return true;
  const effectiveCountryCode: CountryCode = countryCode ?? "GB";
  try {
    const parsedPhoneNumber = parsePhoneNumberFromString(
      input,
      effectiveCountryCode
    );
    return parsedPhoneNumber ? parsedPhoneNumber.isValid() : false;
  } catch (error) {
    console.log("Error validating phone number: ", error);
    return false;
  }
};
