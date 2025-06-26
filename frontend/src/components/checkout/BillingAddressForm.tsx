import { useWatch, useFormContext } from "react-hook-form";
import {
  BillingAddressData,
  BillingAddressSchema,
  countryList,
} from "../../schemas/BillingAddressSchema";
import { useEffect } from "react";

type FieldLabelConfig = {
  label: string;
  //   visible: boolean;
};

type CountryFieldSpecificConfig = {
  postalCode: FieldLabelConfig;
  stateProvinceRegion?: FieldLabelConfig;
  county?: FieldLabelConfig;
};

const countryFieldConfigs: Record<string, CountryFieldSpecificConfig> = {
  GB: {
    postalCode: { label: "Postcode" },
    county: { label: "County (Optional)" },
  },
  US: {
    postalCode: { label: "ZIP Code" },
    stateProvinceRegion: { label: "State" },
  },
  CA: {
    postalCode: { label: "Postal Code" },
    stateProvinceRegion: { label: "Province" },
  },
  KR: {
    postalCode: { label: "Postal Code" },
    stateProvinceRegion: { label: "Province" },
  },
};

const fieldsToReset = Object.keys(BillingAddressSchema.shape).filter(
  (key) => key !== "country"
) as (keyof BillingAddressData)[];

const BillingAddressForm = () => {
  const method = useFormContext<BillingAddressData>();
  const { control, register, resetField } = method;
  const selectedCountry = useWatch({ name: "country", control });

  useEffect(() => {
    fieldsToReset.forEach((field) => resetField(field));
  }, [selectedCountry, resetField]);

  return (
    <fieldset>
      <legend>Billing address</legend>
      <select {...register("country")}>
        {countryList.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Address line 1"
        {...register("addressLine1")}
      />
      <input
        type="text"
        placeholder="Address line 2"
        {...register("addressLine2")}
      />
      {selectedCountry === "KR" ? (
        <input
          type="text"
          placeholder="City or district"
          {...register("city")}
        />
      ) : (
        <input type="text" placeholder="Town or city" {...register("city")} />
      )}
      {selectedCountry === "GB" && (
        <input
          type="text"
          placeholder={countryFieldConfigs[selectedCountry].county?.label}
          {...register("county")}
        />
      )}
      {["US", "CA"].includes(selectedCountry) && (
        <input
          type="text"
          placeholder={
            countryFieldConfigs[selectedCountry].stateProvinceRegion?.label
          }
          {...register("stateProvinceRegion")}
        />
      )}
      <input
        type="text"
        placeholder={countryFieldConfigs[selectedCountry].postalCode?.label}
        {...register("postalCode")}
      />
    </fieldset>
  );
};

export default BillingAddressForm;
