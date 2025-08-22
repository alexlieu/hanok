import { tv } from "tailwind-variants";
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from "react-aria-components";
import { inputStyles } from "./TextField";
import { forwardRef, useEffect, useState } from "react";
import { Description, FieldError, FieldGroup, Input, Label } from "./Field";
import { Select, SelectItem, SelectSection } from "./Select";
import {
  countries,
  CountryCodeUnion,
  groupedCountries,
  SingleCountryType,
} from "../../../schemas/PhoneSchema";

const fieldStyles = tv({
  extend: inputStyles,
  base: "min-w-[208px] w-auto focus-within:ring-offset-[2px]",
});

export interface PhoneFieldProps
  extends Omit<AriaTextFieldProps, "value" | "onChange"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  phoneNumber: string | undefined;
  countryCode: CountryCodeUnion; // this needs to be initialized before runtime
  onPhoneNumberChange: (value: string) => void;
  onCountryCodeChange: (code: CountryCodeUnion) => void;
}

function getCountryFromCode(code: CountryCodeUnion) {
  return countries.find((c) => c.code === code) || countries[0];
}

function cleanPhoneNumber(input: string, countryDetails: SingleCountryType) {
  const cleanedDigits = input.replace(/[^0-9]/g, "");

  let formattedResult = "";
  let digitIndex = 0;

  for (let i = 0; i < countryDetails.example.length; i++) {
    const exampleChar = countryDetails.example[i];

    if (digitIndex >= cleanedDigits.length) {
      break;
    }

    if (/[0-9]/.test(exampleChar)) {
      formattedResult += cleanedDigits[digitIndex];
      digitIndex++;
    } else {
      formattedResult += exampleChar;
    }
  }

  if (digitIndex < cleanedDigits.length) {
    formattedResult += cleanedDigits.substring(digitIndex);
  }

  return formattedResult;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      label,
      description,
      errorMessage,
      isInvalid,
      isRequired,
      phoneNumber,
      countryCode,
      onPhoneNumberChange,
      onCountryCodeChange,
      ...props
    },
    ref
  ) => {
    const [countryDetails, setCountryDetails] = useState(
      getCountryFromCode(countryCode)
    );

    useEffect(() => {
      setCountryDetails(getCountryFromCode(countryCode));
    }, [countryCode]);

    return (
      <AriaTextField {...props} isInvalid={isInvalid}>
        <Label>{label}</Label>
        <FieldGroup className={fieldStyles}>
          {(renderProps) => (
            <>
              <Select
                aria-label="Country select for phone number"
                placeholder="Country"
                selectedKey={countryCode}
                onSelectionChange={(key) =>
                  onCountryCodeChange(key as CountryCodeUnion)
                }
              >
                {Object.entries(groupedCountries).map(([letter, countries]) => (
                  <SelectSection title={letter}>
                    {countries.map(({ name, phone, code }) => (
                      <SelectItem id={code}>
                        {name} (+{phone})
                      </SelectItem>
                    ))}
                  </SelectSection>
                ))}
              </Select>
              <Input
                value={phoneNumber}
                ref={ref}
                className="focus:outline-0"
                placeholder={getCountryFromCode(countryCode).example}
                onChange={(e) =>
                  onPhoneNumberChange(
                    cleanPhoneNumber(e.target.value, countryDetails)
                  )
                }
              />
            </>
          )}
        </FieldGroup>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    );
  }
);
