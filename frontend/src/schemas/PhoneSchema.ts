import { z } from "zod/v4";
import { validatePhoneNumber } from "../validator/PhoneNumberValidator";
import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";

export interface Country {
  name: string;
  code: string;
  phone: string;
  example: string;
}

export const countries = [
  { name: "Afghanistan", code: "AF", phone: "93", example: "070 123 4567" },
  { name: "Albania", code: "AL", phone: "355", example: "067 123 4567" },
  { name: "Algeria", code: "DZ", phone: "213", example: "0551 23 45 67" },
  { name: "Andorra", code: "AD", phone: "376", example: "312 345" },
  { name: "Angola", code: "AO", phone: "244", example: "912 345 678" },
  { name: "Argentina", code: "AR", phone: "54", example: "11 2345-6789" },
  { name: "Australia", code: "AU", phone: "61", example: "0412 345 678" },
  { name: "Austria", code: "AT", phone: "43", example: "0660 1234567" },
  { name: "Brazil", code: "BR", phone: "55", example: "11 98765-4321" },
  { name: "Canada", code: "CA", phone: "1", example: "(416) 555-0123" },
  { name: "China", code: "CN", phone: "86", example: "138 1234 5678" },
  { name: "Denmark", code: "DK", phone: "45", example: "23 45 67 89" },
  { name: "Egypt", code: "EG", phone: "20", example: "0100 123 4567" },
  { name: "Finland", code: "FI", phone: "358", example: "040 1234567" },
  { name: "France", code: "FR", phone: "33", example: "06 12 34 56 78" },
  { name: "Germany", code: "DE", phone: "49", example: "0171 1234567" },
  { name: "Greece", code: "GR", phone: "30", example: "697 123 4567" },
  { name: "Hong Kong", code: "HK", phone: "852", example: "5123 4567" },
  { name: "Hungary", code: "HU", phone: "36", example: "20 123 4567" },
  { name: "Iceland", code: "IS", phone: "354", example: "612 3456" },
  { name: "India", code: "IN", phone: "91", example: "98765 43210" },
  { name: "Indonesia", code: "ID", phone: "62", example: "0812-3456-7890" },
  { name: "Ireland", code: "IE", phone: "353", example: "087 123 4567" },
  { name: "Italy", code: "IT", phone: "39", example: "333 123 4567" },
  { name: "Japan", code: "JP", phone: "81", example: "090-1234-5678" },
  { name: "Kenya", code: "KE", phone: "254", example: "0712 345678" },
  { name: "Luxembourg", code: "LU", phone: "352", example: "621 123 456" },
  { name: "Malaysia", code: "MY", phone: "60", example: "012-345 6789" },
  { name: "Mexico", code: "MX", phone: "52", example: "55 1234 5678" },
  { name: "Netherlands", code: "NL", phone: "31", example: "06 12345678" },
  { name: "New Zealand", code: "NZ", phone: "64", example: "021 123 4567" },
  { name: "Nigeria", code: "NG", phone: "234", example: "0801 234 5678" },
  { name: "Norway", code: "NO", phone: "47", example: "412 34 567" },
  { name: "Oman", code: "OM", phone: "968", example: "9123 4567" },
  { name: "Pakistan", code: "PK", phone: "92", example: "0300 1234567" },
  { name: "Palestine", code: "PS", phone: "970", example: "059 123 4567" },
  { name: "Philippines", code: "PH", phone: "63", example: "0917 123 4567" },
  { name: "Poland", code: "PL", phone: "48", example: "500 123 456" },
  { name: "Portugal", code: "PT", phone: "351", example: "912 345 678" },
  { name: "Qatar", code: "QA", phone: "974", example: "5512 3456" },
  { name: "Romania", code: "RO", phone: "40", example: "0712 345 678" },
  { name: "Russia", code: "RU", phone: "7", example: "912 345-67-89" },
  { name: "Saudi Arabia", code: "SA", phone: "966", example: "050 123 4567" },
  { name: "Singapore", code: "SG", phone: "65", example: "8123 4567" },
  { name: "South Africa", code: "ZA", phone: "27", example: "071 234 5678" },
  { name: "South Korea", code: "KR", phone: "82", example: "010-1234-5678" },
  { name: "Spain", code: "ES", phone: "34", example: "612 34 56 78" },
  { name: "Sweden", code: "SE", phone: "46", example: "070 123 45 67" },
  { name: "Switzerland", code: "CH", phone: "41", example: "079 123 45 67" },
  { name: "Thailand", code: "TH", phone: "66", example: "081 234 5678" },
  { name: "Turkey", code: "TR", phone: "90", example: "0532 123 45 67" },
  { name: "Ukraine", code: "UA", phone: "380", example: "050 123 4567" },
  {
    name: "United Arab Emirates",
    code: "AE",
    phone: "971",
    example: "050 123 4567",
  },
  { name: "United Kingdom", code: "GB", phone: "44", example: "07911 123456" },
  { name: "United States", code: "US", phone: "1", example: "(212) 555-0100" },
  { name: "Vietnam", code: "VN", phone: "84", example: "090 123 45 67" },
  { name: "Yemen", code: "YE", phone: "967", example: "771 234 567" },
  { name: "Zambia", code: "ZM", phone: "260", example: "097 1234567" },
  { name: "Zimbabwe", code: "ZW", phone: "263", example: "077 123 4567" },
] as const;
// sort((a, b) => a.name.localeCompare(b.name));

export const groupedCountries = countries.reduce((acc, country) => {
  const firstLetter = country.name.charAt(0).toUpperCase();
  if (!acc[firstLetter]) {
    acc[firstLetter] = [];
  }
  acc[firstLetter].push(country);
  return acc;
}, {} as Record<string, Country[]>);

type CountriesArrayType = typeof countries;
export type SingleCountryType = CountriesArrayType[number];
export type CountryCodeUnion = SingleCountryType["code"];

const countryCodes = countries.map((country) => country.code);

const CountryCodeSchema = z.enum(countryCodes as [string, ...string[]]);

export const PhoneSchema = z
  .object({
    countryCode: CountryCodeSchema,
    phoneNumber: z.union([z.string(), z.literal(undefined)]),
  })
  .superRefine(({ countryCode, phoneNumber }, ctx) => {
    if (phoneNumber) {
      const isValid = validatePhoneNumber(
        phoneNumber,
        countryCode as CountryCode
      );
      if (!isValid) {
        ctx.addIssue({
          code: "custom",
          message: `Please provide a valid ${countryCode} phone number.`,
          path: ["phoneNumber"],
        });
      }
    }
  })
  .transform((data) => {
    const cleanedPhoneNumber = data.phoneNumber?.trim();
    if (!cleanedPhoneNumber) {
      return {
        countryCode: data.countryCode as CountryCodeUnion,
        phoneNumber: data.phoneNumber,
      };
    }
    const parsedPhoneNumberObject = parsePhoneNumberFromString(
      cleanedPhoneNumber,
      data.countryCode as CountryCode
    );

    const formattedPhoneNumber = parsedPhoneNumberObject?.isValid()
      ? parsedPhoneNumberObject.format("E.164")
      : cleanedPhoneNumber;

    return {
      countryCode: data.countryCode as CountryCodeUnion,
      phoneNumber: formattedPhoneNumber,
    };
  });

export type PhoneData = z.infer<typeof PhoneSchema>;
