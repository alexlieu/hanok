import { z } from "zod/v4";
import { ValidStatesProvincesRegions } from "../types/ValidStatesProvincesRegions";

export const COUNTRY_CODES = ["GB", "US", "CA", "KR"] as const;

export const CountryEnum = z.enum(COUNTRY_CODES);

export const countryList = [
  { value: COUNTRY_CODES[0], label: "United Kingdom" },
  { value: COUNTRY_CODES[1], label: "United States" },
  { value: COUNTRY_CODES[2], label: "Canada" },
  { value: COUNTRY_CODES[3], label: "Korea" },
] as const;

export const BillingAddressSchema = z
  .object({
    country: CountryEnum,
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    stateProvinceRegion: z.string().optional(),
    county: z.string().optional(),
    postalCode: z.string().optional(),
  })
  .superRefine(
    (
      {
        country,
        addressLine1,
        addressLine2,
        city,
        stateProvinceRegion,
        county,
        postalCode,
      },
      ctx
    ) => {
      function addCtxIssue(
        message: string,
        path: (keyof BillingAddressData)[]
      ) {
        ctx.addIssue({
          code: "custom",
          message: message,
          path: path,
        });
      }
      if (!postalCode) {
        const message =
          country === "US"
            ? "ZIP Code is required"
            : country === "GB"
            ? "Postcode is required."
            : "Postal Code is required.";
        addCtxIssue(message, ["postalCode"]);
      }
      if (!addressLine1) {
        addCtxIssue("Address Line 1 is required.", ["addressLine1"]);
      } else {
        const min = 3;
        if (addressLine1.length < min) {
          addCtxIssue(
            `Entry is too short. Please provide at least ${min} characters.`,
            ["addressLine1"]
          );
        }
        const max = 40;
        if (addressLine1.length > max) {
          addCtxIssue(
            `Entry is too long. Please provide ${max} characters or less.`,
            ["addressLine1"]
          );
        }
      }
      if (addressLine2) {
        const min = 3;
        if (addressLine2.length < min) {
          addCtxIssue(
            `Entry is too short. Please provide at least ${min} characters.`,
            ["addressLine2"]
          );
        }
        const max = 30;
        if (addressLine2.length > max) {
          addCtxIssue(
            `Entry is too long. Please provide a maximum of ${max} characters.`,
            ["addressLine2"]
          );
        }
      }
      if (!city) {
        addCtxIssue("Town or City is required.", ["city"]);
      } else {
        const min = 3;
        if (city.length < min) {
          addCtxIssue(
            `Entry is too short. Please provide at least ${min} characters.`,
            ["city"]
          );
        }
        const max = 30;
        if (city.length > max) {
          addCtxIssue(
            `Entry is too long. Please provide a maximum of ${max} characters.`,
            ["city"]
          );
        }
      }
      if (["US", "CA", "KR"].includes(country) && !stateProvinceRegion) {
        const message =
          country === "US"
            ? "State is required for US."
            : `Province is required for ${country}.`;
        ctx.addIssue({
          code: "custom",
          message: message,
          path: ["stateProvinceRegion"],
        });
      }
      if (["US", "CA", "KR"].includes(country) && county) {
        addCtxIssue(`County should not be provided for ${country}.`, [
          "country",
        ]);
      }
      switch (country) {
        case "GB": {
          const regexp = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/i;
          if (!regexp.test(postalCode!)) {
            addCtxIssue("Invalid UK Postcode format.", ["postalCode"]);
          }
          if (county && county.length < 4) {
            addCtxIssue(
              "Entry too short. County must be at least 4 characters.",
              ["county"]
            );
          }
          break;
        }
        case "US": {
          const regexp = /^\d{5}(?:[-\s]\d{4})?$/i;
          if (!regexp.test(postalCode!)) {
            addCtxIssue("Invalid US Zip Code format.", ["postalCode"]);
          }
          break;
        }
        case "CA": {
          const regexp =
            /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
          if (!regexp.test(postalCode!)) {
            addCtxIssue("Invalid CA Postal Code format.", ["postalCode"]);
          }
          break;
        }
        case "KR": {
          const regexp = /^(0[1-9]|[1-5]\d|6[0-3])\d{3}$/;
          if (!regexp.test(postalCode!)) {
            addCtxIssue("Invalid KR Postal Code format.", ["postalCode"]);
          }
          break;
        }
      }
    }
  );

export const createBillingAddressSchema = (
  validStatesProvincesRegions: ValidStatesProvincesRegions
) => {
  return BillingAddressSchema.superRefine(
    ({ stateProvinceRegion, country }, ctx) => {
      if (country === "KR") {
        if (
          !validStatesProvincesRegions.KR_PROVINCES.has(stateProvinceRegion!)
        ) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid province ${stateProvinceRegion} for ${country}.`,
            path: ["stateProvinceRegion"],
          });
        }
      }
      if (country === "US") {
        if (!validStatesProvincesRegions.US_STATES[stateProvinceRegion!]) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid state ${stateProvinceRegion} for ${country}.`,
            path: ["stateProvinceRegion"],
          });
        }
      }
      if (country === "CA") {
        if (!validStatesProvincesRegions.CA_PROVINCES[stateProvinceRegion!]) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid province ${stateProvinceRegion} for ${country}.`,
            path: ["stateProvinceRegion"],
          });
        }
      }
    }
  );
};

export type BillingAddressData = z.infer<typeof BillingAddressSchema>;
