import { z } from "zod/v4";

export const COUNTRY_CODES = ["GB", "US", "CA", "KR"] as const;

export const CountryEnum = z.enum(COUNTRY_CODES);

export const countryList = [
  { value: COUNTRY_CODES[0], label: "United Kingdom" },
  { value: COUNTRY_CODES[1], label: "United States" },
  { value: COUNTRY_CODES[2], label: "Canada" },
  { value: COUNTRY_CODES[3], label: "Korea" },
];

export const BillingAddressSchema = z
  .object({
    country: CountryEnum,
    addressLine1: z.string().min(5).max(100),
    addressLine2: z.string().max(100).optional().or(z.literal("")),
    townCity: z.string().min(2).max(50),
    stateProvinceRegion: z.string().max(50).optional().or(z.literal("")),
    county: z.string().max(50).optional().or(z.literal("")),

    krCityDistrict: z.string().min(2).max(100).optional().or(z.literal("")),

    postalCode: z.string().min(3).max(15),
  })
  .check((ctx) => {
    const { country, stateProvinceRegion, krCityDistrict, postalCode } =
      ctx.value;

    if (
      (country === COUNTRY_CODES[1] || country === COUNTRY_CODES[2]) &&
      (stateProvinceRegion === "" || !stateProvinceRegion)
    ) {
      ctx.issues.push({
        code: "custom",
        message: "State/Province is required for this country.",
        path: ["stateProvinceRegion"],
        input: ctx.value,
      });
    }

    switch (country) {
      case COUNTRY_CODES[0]: {
        const regexp = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/i;
        if (!regexp.test(postalCode)) {
          ctx.issues.push({
            code: "custom",
            message: "Invalid UK Post Code format.",
            path: ["postalCode"],
            input: ctx.value,
          });
        }
        break;
      }
      case COUNTRY_CODES[1]: {
        const regexp = /^\d{5}(?:[-\s]\d{4})?$/i;
        if (!regexp.test(postalCode)) {
          ctx.issues.push({
            code: "custom",
            message: "Invalid US Zip Code format.",
            path: ["postalCode"],
            input: ctx.value,
          });
        }
        break;
      }
      case COUNTRY_CODES[2]: {
        const regexp =
          /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
        if (!regexp.test(postalCode)) {
          ctx.issues.push({
            code: "custom",
            message: "Invalid CA Postal Code format.",
            path: ["postalCode"],
            input: ctx.value,
          });
        }
        break;
      }
      case COUNTRY_CODES[3]: {
        const regexp = /^(0[1-9]|[1-5]\d|6[0-3])\d{3}$/;
        if (!regexp.test(postalCode)) {
          ctx.issues.push({
            code: "custom",
            message: "Invalid KR Postal Code format.",
            path: ["postalCode"],
            input: ctx.value,
          });
        }
        if (!krCityDistrict || krCityDistrict.trim() === "") {
          ctx.issues.push({
            code: "custom",
            message: "City/District is required for KR addresses.",
            path: ["krCityDistrict"],
            input: ctx.value,
          });
        }
        break;
      }
    }
  });

export type BillingAddressData = z.infer<typeof BillingAddressSchema>;
