import { tv } from "tailwind-variants";
import { TextFieldProps, TextField } from "react-aria-components";
import { memo, useId, useState } from "react";
import { AnimatedFieldError, Description, FieldGroup, Input } from "./Field";
import { Select, SelectItem, SelectSection } from "./Select";
import {
  countries,
  CountryCodeUnion,
  groupedCountries,
  SingleCountryType,
} from "../../../schemas/PhoneSchema";
import * as Flags from "country-flag-icons/react/3x2";
import { composeTailwindRenderProps } from "./utils";
import { RefCallBack } from "react-hook-form";
import { createLabel } from "./utils/createLabel";
import { CircleChevronDownIcon } from "../icons/CircleChevronDown";
import { twMerge } from "tailwind-merge";

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

const buttonStyles = tv({
  base: "flex items-center text-start w-full cursor-default px-1 my-auto ml-1 py-1 focus:outline-none inset-ring-brand-focus",
  variants: {
    isDisabled: {
      true: "opacity-30",
    },
    isFocusVisible: {
      false: "inset-ring-0",
      true: "inset-ring-2 transition-shadow",
    },
  },
});

export interface PhoneFieldProps
  extends Omit<TextFieldProps, "value" | "onChange"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  inputRef?: RefCallBack;
  phoneNumber: string | undefined;
  countryCode: CountryCodeUnion; // this needs to be initialized before runtime
  onPhoneNumberChange: (value: string) => void;
  onCountryCodeChange: (code: CountryCodeUnion) => void;
}

export const PhoneField = memo(function PhoneField({
  label,
  description,
  errorMessage,
  inputRef,
  isInvalid,
  isDisabled,
  phoneNumber,
  countryCode,
  onPhoneNumberChange,
  onCountryCodeChange,
  ...props
}: PhoneFieldProps) {
  const countryDetails = getCountryFromCode(countryCode);

  function getCountryFlag(playAnimation: boolean) {
    const SelectedFlagComponent =
      countryCode && Flags[countryCode as keyof typeof Flags];
    return (
      <div>
        <SelectedFlagComponent
          title={countryDetails.name}
          className="h-5 border-[2px] border-brand-colour-5 rounded-xs"
        />
        <CircleChevronDownIcon
          aria-hidden
          className="absolute bottom-0.5 -right-0.5"
          size="0.9rem"
          fill="var(--color-default-bg)"
          strokeWidth={3}
          stroke={
            isDisabled
              ? "var(--color-disabled-text)"
              : "var(--color-brand-colour-5)"
          }
          playAnimation={playAnimation}
        />
      </div>
    );
  }

  const [isFocused, setIsFocused] = useState(false);

  const inputId = useId();
  const labelId = useId();

  return (
    <TextField
      isDisabled={isDisabled}
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1"
      )}
      isInvalid={isInvalid}
      onFocusChange={setIsFocused}
      aria-labelledby={labelId}
    >
      {createLabel({
        label,
        isFocused,
        isInvalid,
        id: labelId,
        htmlFor: inputId,
      })}
      <FieldGroup className={`min-w-[208px] w-auto`}>
        <Select
          name="country-code-select"
          aria-label="Country select for phone number"
          placeholder="Country"
          value={countryCode}
          onChange={(key) => onCountryCodeChange(key as CountryCodeUnion)}
          listBoxClassNames="max-h-[300px]"
          buttonClassNames={buttonStyles}
          customSelectValue={({ isHovered, isFocused }) =>
            getCountryFlag(isHovered || isFocused)
          }
          isDisabled={isDisabled}
          defaultChevron={false}
          onFocusChange={setIsFocused}
          widePopover={true}
        >
          {Object.entries(groupedCountries).map(([letter, countries]) => (
            <SelectSection title={letter} key={letter}>
              {countries.map(({ name, phone, code }) => (
                <SelectItem
                  id={code}
                  key={code}
                  textValue={`${name} ${code}`}
                  rightSlot={
                    <span className="group-focus:text-default-bg">
                      +{phone}
                    </span>
                  }
                >
                  <span className="fit">{name}</span>
                </SelectItem>
              ))}
            </SelectSection>
          ))}
        </Select>
        <Input
          id={inputId}
          value={phoneNumber}
          inputRef={inputRef}
          className={twMerge(
            "focus:outline-0 flex-1 text-sm",
            isDisabled && "text-disabled-text"
          )}
          placeholder={getCountryFromCode(countryCode).example}
          onChange={(e) =>
            onPhoneNumberChange(
              cleanPhoneNumber(e.target.value, countryDetails)
            )
          }
        />
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <AnimatedFieldError isInvalid={isInvalid} children={errorMessage} />
    </TextField>
  );
});
