import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import {
  BillingAddressData,
  BillingAddressSchema,
  countryList,
} from "../../schemas/BillingAddressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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

const DEFAULT_VALUES: BillingAddressData = {
  country: "GB",
  addressLine1: "",
  addressLine2: "",
  townCity: "",
  stateProvinceRegion: "",
  county: "",
  postalCode: "",
  krCityDistrict: "",
};

const BillingAddressForm = () => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingAddressData>({
    resolver: zodResolver(BillingAddressSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    criteriaMode: "all",
  });

  const selectedCountry = useWatch({ name: "country", control });

  useEffect(() => {
    const resetFieldValues = {
      ...DEFAULT_VALUES,
      country: selectedCountry,
    };
    reset(resetFieldValues);
  }, [selectedCountry, reset]);

  console.log(errors);

  const onSubmit: SubmitHandler<BillingAddressData> = (data) => {
    console.log("Submit data: ", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            {...register("krCityDistrict")}
          />
        ) : (
          <input
            type="text"
            placeholder="Town or city"
            {...register("townCity")}
          />
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
        <button type="submit">Check billing address</button>
      </fieldset>
    </form>
  );
};

export default BillingAddressForm;
