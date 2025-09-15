import { useWatch, useFormContext, Controller } from "react-hook-form";
import {
  BillingAddressData,
  BillingAddressSchema,
  countryList,
  KR_PROVINCES,
} from "../../schemas/BillingAddressSchema";
import { useEffect } from "react";
import { Select, SelectItem } from "../ui/aria/Select";
import { selectButtonStyles as defaultSelectButtonStyles } from "../ui/aria/styles/selectButtonStyles";
import { inputStyles } from "../ui/aria/styles/inputStyles";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { TextField } from "../ui/aria/TextField";
import { COUNTRY_CODES } from "../../schemas/BillingAddressSchema";

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

  function checkIsCountry(countries: (typeof COUNTRY_CODES)[number][]) {
    return countries.includes(selectedCountry);
  }

  useEffect(() => {
    fieldsToReset.forEach((field) => resetField(field));
  }, [selectedCountry, resetField]);

  return (
    <fieldset>
      <div>
        <legend className="uppercase tracking-wide text-xl mb-2">
          Billing address
        </legend>
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
                defaultSelectedKey={"GB"}
                isInvalid={invalid}
                errorMessage={error?.message}
                inputRef={ref}
                selectedKey={value}
                onSelectionChange={onChange}
                className={"mb-3"}
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
        <div className="flex flex-col gap-3">
          {checkIsCountry(["KR"]) && (
            <>
              <Controller
                name="postalCode"
                control={control}
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error },
                }) => {
                  return (
                    <TextField
                      label={
                        countryFieldConfigs[selectedCountry].postalCode?.label
                      }
                      placeholder={
                        countryFieldConfigs[selectedCountry].postalCode?.label
                      }
                      isRequired
                      inputRef={ref}
                      maxLength={15}
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      className={`flex-1`}
                      {...field}
                    />
                  );
                }}
              />
              <div className="flex gap-3">
                <Controller
                  name="krProvince"
                  control={control}
                  render={({
                    field: { ref, onChange, value, ...field },
                    fieldState: { invalid, error },
                  }) => {
                    return (
                      <Select
                        label="Province"
                        className={"flex-1"}
                        isRequired
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        inputRef={ref}
                        selectedKey={value}
                        onSelectionChange={onChange}
                        buttonClassNames={selectButtonStyles}
                        {...field}
                      >
                        {KR_PROVINCES.map((value) => (
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
                        inputRef={ref}
                        isRequired
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        {...field}
                      />
                    );
                  }}
                />
              </div>
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
                  inputRef={ref}
                  isInvalid={invalid}
                  isRequired
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
                  label="Address line 2"
                  placeholder="Address line 2"
                  inputRef={ref}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              );
            }}
          />
          {!checkIsCountry(["KR"]) && (
            <div className="flex gap-3">
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
                      inputRef={ref}
                      isRequired
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      {...field}
                    />
                  );
                }}
              />
              {checkIsCountry(["US", "CA"]) && (
                <Controller
                  name="stateProvinceRegion"
                  control={control}
                  render={({
                    field: { ref, ...field },
                    fieldState: { invalid, error },
                  }) => {
                    return (
                      <TextField
                        className={"flex-1"}
                        label={
                          countryFieldConfigs[selectedCountry]
                            .stateProvinceRegion?.label
                        }
                        placeholder={
                          countryFieldConfigs[selectedCountry]
                            .stateProvinceRegion?.label
                        }
                        inputRef={ref}
                        isRequired
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        {...field}
                      />
                    );
                  }}
                />
              )}
              <Controller
                name="postalCode"
                control={control}
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error },
                }) => {
                  return (
                    <TextField
                      label={
                        countryFieldConfigs[selectedCountry].postalCode?.label
                      }
                      placeholder={
                        countryFieldConfigs[selectedCountry].postalCode?.label
                      }
                      isRequired
                      inputRef={ref}
                      maxLength={15}
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      className={`flex-1`}
                      {...field}
                    />
                  );
                }}
              />
            </div>
          )}
          {checkIsCountry(["GB"]) && (
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
        </div>
      </div>
    </fieldset>
  );
};

export default BillingAddressForm;
