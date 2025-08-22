import { tv } from "tailwind-variants";
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from "react-aria-components";
import { inputStyles } from "./TextField";
import { forwardRef, memo, useEffect, useRef, useState } from "react";
import { Description, FieldError, FieldGroup, Input, Label } from "./Field";
import { Select, SelectItem, SelectSection } from "./Select";
import {
  countries,
  CountryCodeUnion,
  groupedCountries,
  SingleCountryType,
} from "../../../schemas/PhoneSchema";
import * as Flags from "country-flag-icons/react/3x2";
import { composeTailwindRenderProps } from "./utils";

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

const fieldStyles = tv({
  extend: inputStyles,
  base: "min-w-[208px] w-auto focus-within:ring-offset-[2px]",
});

const buttonStyles = tv({
  base: "flex items-center text-start w-full cursor-default px-1 mx-1 py-1 focus:outline-none",
  variants: {
    isDisabled: {
      true: "bg-stone-300",
    },
    isFocusVisible: {
      true: "inset-ring-2 inset-ring-brand-focus transition-[shadow]",
    },
  },
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

export const PhoneField = memo(
  forwardRef<HTMLInputElement, PhoneFieldProps>(
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
      const listBoxRef = useRef<HTMLDivElement>(null);

      const countryDetails = getCountryFromCode(countryCode);

      function getCountryFlag() {
        const SelectedFlagComponent =
          countryCode && Flags[countryCode as keyof typeof Flags];
        return (
          <>
            <SelectedFlagComponent
              title={countryDetails.name}
              className="h-5 border-[2px] border-brand-colour-5 rounded-xs"
            />
          </>
        );
      }

      const [selectOpen, setSelectOpen] = useState(false);
      const [isFocused, setIsFocused] = useState(false);

      // React guarantees that all DOM updates have been flushed and the DOM is ready before it runs useEffect.
      // This ensures that side effects, such as the scrollIntoView, are performed on a stable, up-to-date DOM tree.
      useEffect(() => {
        if (selectOpen && listBoxRef.current) {
          const selectedItem = listBoxRef.current?.querySelector<HTMLElement>(
            `[data-key="${countryCode}"]`
          );
          if (selectedItem) {
            selectedItem.scrollIntoView({
              block: "end",
              behavior: "instant",
            });
          }
        }
      }, [selectOpen]);

      return (
        <AriaTextField
          {...props}
          className={composeTailwindRenderProps(
            props.className,
            "flex flex-col gap-1"
          )}
          isInvalid={isInvalid}
          onFocusChange={(isFocused) => {
            setIsFocused(isFocused);
          }}
        >
          <Label>
            <span
              className={`${
                isFocused && "overline decoration-3 decoration-brand-colour-3"
              }`}
            >
              {label}
            </span>
          </Label>
          <FieldGroup className={fieldStyles}>
            <>
              <Select
                onFocusChange={(isFocused) => setIsFocused(isFocused)}
                listBoxRef={listBoxRef}
                aria-label="Country select for phone number"
                placeholder="Country"
                selectedKey={countryCode}
                listBoxClassNames="max-h-[300px]"
                buttonClassNames={buttonStyles}
                onSelectionChange={(key) => {
                  onCountryCodeChange(key as CountryCodeUnion);
                }}
                onOpenChange={setSelectOpen}
                customSelectValue={getCountryFlag()}
              >
                {Object.entries(groupedCountries).map(([letter, countries]) => (
                  <SelectSection title={letter} key={letter}>
                    {countries.map(({ name, phone, code }) => (
                      <SelectItem
                        id={code}
                        key={code}
                        textValue={`${name} ${code}`}
                      >
                        {name} (+{phone})
                      </SelectItem>
                    ))}
                  </SelectSection>
                ))}
              </Select>
              <Input
                value={phoneNumber}
                ref={ref}
                className="focus:outline-0 flex-1"
                placeholder={getCountryFromCode(countryCode).example}
                onChange={(e) =>
                  onPhoneNumberChange(
                    cleanPhoneNumber(e.target.value, countryDetails)
                  )
                }
              />
            </>
          </FieldGroup>
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </AriaTextField>
      );
    }
  )
);
