import { useWatch, useFormContext, Controller } from "react-hook-form";
import {
  BillingAddressData,
  BillingAddressSchema,
  countryList,
} from "../../schemas/BillingAddressSchema";
import { useEffect } from "react";
import { Select, SelectItem } from "../ui/aria/Select";
import { borderedSelectButtonStyles } from "../ui/aria/styles/borderedSelectButtonStyles";
import { TextField } from "../ui/aria/TextField";
import { COUNTRY_CODES } from "../../schemas/BillingAddressSchema";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";
import {
  cleanPostalCode,
  getPostalCodeMaxLength,
} from "../../utils/postalCodeUtils";
import { checkIsCountry } from "../../utils/countryUtils";
import { useServerErrors } from "../../utils/hooks/features/checkout/useServerErrors";

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
  const serverErrors = useServerErrors();

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
        const zodError = error?.message;
        const serverError = serverErrors.validationErrors.country?.[0]?.message;
        const errorMessage = zodError || serverError;
        const invalidState = !!(invalid || serverError);
        return (
          <Select
            label="Country"
            isInvalid={invalidState}
            errorMessage={errorMessage}
            className="h-fit"
            inputRef={ref}
            value={value}
            onChange={onChange}
            buttonClassNames={borderedSelectButtonStyles}
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

  const cityTextField = (
    <Controller
      name="city"
      control={control}
      render={({
        field: { ref, ...field },
        fieldState: { invalid, error },
      }) => {
        const zodError = error?.message;
        const serverError = serverErrors.validationErrors.city?.[0]?.message;
        const errorMessage = zodError || serverError;
        const invalidState = !!(invalid || serverError);
        return (
          <TextField
            className={"flex-1"}
            label={"Town or City"}
            placeholder={"Town or City"}
            maxLength={30}
            inputRef={ref}
            isRequired
            isInvalid={invalidState}
            errorMessage={errorMessage}
            {...field}
          />
        );
      }}
    />
  );

  const createStateProvinceRegionSelectField = () => {
    const config = (() => {
      switch (selectedCountry) {
        case "KR":
          return { label: "Province", options: KR_PROVINCES };
        case "US":
          return { label: "State", options: US_STATES };
        case "CA":
          return { label: "Province", options: CA_PROVINCES };
        default:
          return null;
      }
    })();
    if (!config) return null;
    return (
      <Controller
        name="stateProvinceRegion"
        control={control}
        render={({
          field: { ref, onChange, value, ...field },
          fieldState: { invalid, error },
        }) => {
          const zodError = error?.message;
          const serverError =
            serverErrors.validationErrors.stateProvinceRegion?.[0]?.message;
          const errorMessage = zodError || serverError;
          const invalidState = !!(invalid || serverError);
          return (
            <Select
              label={config.label}
              className={"flex-1 min-w-0 h-fit"}
              isRequired
              isInvalid={invalidState}
              errorMessage={errorMessage}
              inputRef={ref}
              value={value}
              onChange={onChange}
              buttonClassNames={borderedSelectButtonStyles}
              {...field}
            >
              {config.options instanceof Set
                ? Array.from(config.options).map((value) => (
                    <SelectItem key={value} id={value}>
                      {value}
                    </SelectItem>
                  ))
                : Object.entries(config.options).map(([key, value]) => (
                    <SelectItem key={key} id={key}>
                      {value}
                    </SelectItem>
                  ))}
            </Select>
          );
        }}
      />
    );
  };

  const postalCodeTextField = (
    <Controller
      name="postalCode"
      control={control}
      render={({
        field: { ref, onChange, ...field },
        fieldState: { invalid, error },
      }) => {
        const zodError = error?.message;
        const serverError =
          serverErrors.validationErrors.postalCode?.[0]?.message;
        const errorMessage = zodError || serverError;
        const invalidState = !!(invalid || serverError);
        return (
          <TextField
            label={countryFieldConfigs[selectedCountry].postalCode?.label}
            placeholder={countryFieldConfigs[selectedCountry].postalCode?.label}
            onChange={(input) =>
              cleanPostalCode(input, selectedCountry, onChange)
            }
            isRequired
            inputRef={ref}
            maxLength={getPostalCodeMaxLength(selectedCountry)}
            isInvalid={invalidState}
            errorMessage={errorMessage}
            className={`flex-1`}
            {...field}
          />
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
          {postalCodeTextField}
          {createStateProvinceRegionSelectField()}
          {cityTextField}
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
          const zodError = error?.message;
          const serverError =
            serverErrors.validationErrors.addressLine1?.[0]?.message;
          const errorMessage = zodError || serverError;
          const invalidState = !!(invalid || serverError);
          return (
            <TextField
              label="Address line 1"
              placeholder="Address line 1"
              maxLength={40}
              inputRef={ref}
              isInvalid={invalidState}
              isRequired
              className="lg:col-start-1"
              errorMessage={errorMessage}
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
          const zodError = error?.message;
          const serverError =
            serverErrors.validationErrors.addressLine2?.[0]?.message;
          const errorMessage = zodError || serverError;
          const invalidState = !!(invalid || serverError);
          return (
            <TextField
              label="Apartment, suite, etc. (optional)"
              placeholder="Apartment, suite, etc. (optional)"
              maxLength={30}
              inputRef={ref}
              isInvalid={invalidState}
              errorMessage={errorMessage}
              {...field}
            />
          );
        }}
      />
      {!checkIsCountryForComponent(["KR"]) && (
        <>
          {cityTextField}
          {checkIsCountryForComponent(["US", "CA"]) &&
            createStateProvinceRegionSelectField()}
          {postalCodeTextField}
          {checkIsCountryForComponent(["GB"]) && (
            <Controller
              name="county"
              control={control}
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error },
              }) => {
                const zodError = error?.message;
                const serverError =
                  serverErrors.validationErrors.county?.[0]?.message;
                const errorMessage = zodError || serverError;
                const invalidState = !!(invalid || serverError);
                return (
                  <TextField
                    label={countryFieldConfigs["GB"].county?.label}
                    placeholder={countryFieldConfigs["GB"].county?.label}
                    inputRef={ref}
                    isInvalid={invalidState}
                    errorMessage={errorMessage}
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
