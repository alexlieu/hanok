import { useWatch, useFormContext, Controller } from "react-hook-form";
import {
  BillingAddressData,
  BillingAddressSchema,
  countryList,
} from "../../schemas/BillingAddressSchema";
import { useEffect } from "react";
import { Select, SelectItem } from "../ui/aria/Select";
import { selectButtonStyles as defaultSelectButtonStyles } from "../ui/aria/styles/selectButtonStyles";
import { inputStyles } from "../ui/aria/styles/inputStyles";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { TextField } from "../ui/aria/TextField";
import { COUNTRY_CODES } from "../../schemas/BillingAddressSchema";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import {
  cleanPostalCode,
  getPostalCodeMaxLength,
} from "../../utils/postalCodeUtils";
import { checkIsCountry } from "../../utils/countryUtils";

const selectButtonStyles = tv({
  extend: defaultSelectButtonStyles,
  base: twMerge(
    inputStyles.base,
    "h-full focus:border-brand-colour-4 focus-visible:ring-[2px] focus-visible:ring-offset-default-bg focus-visible:ring-offset-[2px] focus-visible:transition-shadow focus-visible:ring-brand-focus"
  ),
});

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
  const { control, resetField } = method;
  const selectedCountry = useWatch({ name: "country", control });
  const {
    validStatesProvincesRegions: { KR_PROVINCES, US_STATES, CA_PROVINCES },
  } = useLoaderData() as CheckoutRequiredData;

  const checkIsCountryForComponent = (
    countries: (typeof COUNTRY_CODES)[number][]
  ) => {
    return checkIsCountry(selectedCountry, countries);
  };

  useEffect(() => {
    fieldsToReset.forEach((field) => resetField(field));
  }, [selectedCountry, resetField]);

  const countrySelectField = (
    <Controller
      name="country"
      control={control}
      render={({
        field: { ref, onChange, value, ...field },
        fieldState: { invalid, error },
      }) => {
        return (
          <Select
            label="Country"
            isInvalid={invalid}
            errorMessage={error?.message}
            inputRef={ref}
            value={value}
            onChange={onChange}
            buttonClassNames={selectButtonStyles}
            {...field}
          >
            {countryList.map(({ value, label }) => (
              <SelectItem key={value} id={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
        );
      }}
    />
  );

  return (
    <fieldset className="grid grid-cols-1 lg:grid-cols-2 gap-[0.7rem]">
      <legend className="lowercase tracking-wide text-lg font-medium mb-2">
        Billing address
      </legend>
      {checkIsCountryForComponent(["KR"]) && (
        <>
          <Controller
            name="postalCode"
            control={control}
            render={({
              field: { ref, onChange, ...field },
              fieldState: { invalid, error },
            }) => {
              return (
                <TextField
                  label={countryFieldConfigs[selectedCountry].postalCode?.label}
                  placeholder={
                    countryFieldConfigs[selectedCountry].postalCode?.label
                  }
                  onChange={(input) =>
                    cleanPostalCode(input, selectedCountry, onChange)
                  }
                  isRequired
                  inputRef={ref}
                  maxLength={getPostalCodeMaxLength(selectedCountry)}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  className={`flex-1`}
                  {...field}
                />
              );
            }}
          />
          <Controller
            name="stateProvinceRegion"
            control={control}
            render={({
              field: { ref, onChange, value, ...field },
              fieldState: { invalid, error },
            }) => {
              return (
                <Select
                  label="Province"
                  className={"flex-1 min-w-0"}
                  isRequired
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  inputRef={ref}
                  value={value}
                  onChange={onChange}
                  buttonClassNames={selectButtonStyles}
                  {...field}
                >
                  {Array.from(KR_PROVINCES).map((value) => (
                    <SelectItem key={value} id={value}>
                      {value}
                    </SelectItem>
                  ))}
                </Select>
              );
            }}
          />
          <Controller
            name="city"
            control={control}
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error },
            }) => {
              return (
                <TextField
                  className={"flex-1"}
                  label={"Town or City"}
                  placeholder={"Town or City"}
                  maxLength={30}
                  inputRef={ref}
                  isRequired
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              );
            }}
          />
          {countrySelectField}
        </>
      )}
      <Controller
        name="addressLine1"
        control={control}
        render={({
          field: { ref, ...field },
          fieldState: { invalid, error },
        }) => {
          return (
            <TextField
              label="Address line 1"
              placeholder="Address line 1"
              maxLength={40}
              inputRef={ref}
              isInvalid={invalid}
              isRequired
              className="lg:col-start-1"
              errorMessage={error?.message}
              {...field}
            />
          );
        }}
      />
      <Controller
        name="addressLine2"
        control={control}
        render={({
          field: { ref, ...field },
          fieldState: { invalid, error },
        }) => {
          return (
            <TextField
              label="Apartment, suite, etc. (optional)"
              placeholder="Apartment, suite, etc. (optional)"
              maxLength={30}
              inputRef={ref}
              isInvalid={invalid}
              errorMessage={error?.message}
              {...field}
            />
          );
        }}
      />
      {!checkIsCountryForComponent(["KR"]) && (
        <>
          <Controller
            name="city"
            control={control}
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error },
            }) => {
              return (
                <TextField
                  className={"flex-1"}
                  label={"Town or City"}
                  placeholder={"Town or City"}
                  maxLength={30}
                  inputRef={ref}
                  isRequired
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              );
            }}
          />
          {checkIsCountryForComponent(["US", "CA"]) && (
            <Controller
              name="stateProvinceRegion"
              control={control}
              render={({
                field: { ref, onChange, value, ...field },
                fieldState: { invalid, error },
              }) => {
                return (
                  <Select
                    label={
                      checkIsCountryForComponent(["US"]) ? "State" : "Province"
                    }
                    className={"flex-1 min-w-0"}
                    isRequired
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    inputRef={ref}
                    value={value}
                    onChange={onChange}
                    buttonClassNames={selectButtonStyles}
                    {...field}
                  >
                    {Object.entries(
                      checkIsCountryForComponent(["US"])
                        ? US_STATES
                        : CA_PROVINCES
                    ).map(([key, value]) => (
                      <SelectItem key={key} id={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </Select>
                );
              }}
            />
          )}
          <Controller
            name="postalCode"
            control={control}
            render={({
              field: { ref, onChange, ...field },
              fieldState: { invalid, error },
            }) => {
              return (
                <TextField
                  label={countryFieldConfigs[selectedCountry].postalCode?.label}
                  placeholder={
                    countryFieldConfigs[selectedCountry].postalCode?.label
                  }
                  isRequired
                  inputRef={ref}
                  maxLength={getPostalCodeMaxLength(selectedCountry)}
                  onChange={(input) =>
                    cleanPostalCode(input, selectedCountry, onChange)
                  }
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  className={`flex-1`}
                  {...field}
                />
              );
            }}
          />
          {checkIsCountryForComponent(["GB"]) && (
            <Controller
              name="county"
              control={control}
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error },
              }) => {
                return (
                  <TextField
                    label={countryFieldConfigs["GB"].county?.label}
                    placeholder={countryFieldConfigs["GB"].county?.label}
                    inputRef={ref}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    {...field}
                  />
                );
              }}
            />
          )}
          {countrySelectField}
        </>
      )}
    </fieldset>
  );
};

export default BillingAddressForm;
