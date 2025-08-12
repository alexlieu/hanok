import { useEffect, useState } from "react";
import { UseFormWatch } from "react-hook-form";
import {
  Country,
  CountryCodeUnion,
  countries,
  PhoneData,
} from "../../schemas/PhoneSchema";
import { FormData } from "../../schemas/CheckoutFormSchema";
import * as Flags from "country-flag-icons/react/3x2";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const DEFAULT_COUNTRY = { name: "United Kingdom", code: "GB" };

type PhoneInputProps = {
  phoneData: PhoneData | null; // The entire phoneNumber object from Controller's value
  onPhoneDataChange: (data: PhoneData) => void; // Controller's onChange for the entire object
  onBlur: () => void; // Controller's onBlur
  inputRef: React.Ref<HTMLInputElement>; // Controller's ref for the input
  watch: UseFormWatch<FormData>; // Pass watch down for internal logic
  errors: boolean;
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  phoneData,
  onPhoneDataChange,
  onBlur,
  inputRef,
  watch,
  errors,
}) => {
  //   const { register, watch, setValue } = useFormContext<FormData>();

  const selectedCountryCode = watch(
    "phoneNumber.countryCode"
  ) as CountryCodeUnion;

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === DEFAULT_COUNTRY.code)!
  );

  useEffect(() => {
    const newCountry =
      countries.find((c) => c.code === selectedCountryCode) || countries[0];
    setSelectedCountry(newCountry);
  }, [selectedCountryCode]);

  const groupedCountries = countries.reduce((acc, country) => {
    const firstLetter = country.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  const SelectedFlagComponent =
    selectedCountry.code && Flags[selectedCountry.code as keyof typeof Flags];

  const [inputFocused, setInputFocused] = useState(false);

  const phoneNumberChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    const cleanedDigits = input.replace(/[^0-9]/g, "");

    let formattedOutput = "";
    let digitIndex = 0;

    for (let i = 0; i < selectedCountry.example.length; i++) {
      const exampleChar = selectedCountry.example[i];

      if (digitIndex >= cleanedDigits.length) {
        break;
      }

      if (/[0-9]/.test(exampleChar)) {
        formattedOutput += cleanedDigits[digitIndex];
        digitIndex++;
      } else {
        formattedOutput += exampleChar;
      }
    }

    if (digitIndex < cleanedDigits.length) {
      formattedOutput += cleanedDigits.substring(digitIndex);
    }

    // setValue("phoneNumber.phoneNumber", formattedOutput);
    onPhoneDataChange({
      countryCode: phoneData?.countryCode,
      phoneNumber: formattedOutput,
    });
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = event.target.value as CountryCodeUnion;
    onPhoneDataChange({
      phoneNumber: phoneData?.phoneNumber, // Retain existing phoneNumber, if any
      countryCode: newCountryCode, // Update only countryCode
    });
  };

  return (
    <div
      className={`flex flex-row  border-2
        ${inputFocused && "noninput-focus-styling"}
        ${errors ? "border-error-red" : "border-gray-300"}`}
    >
      <div className="relative w-13  flex-shrink-0 group -mt-[2px] -ml-[2px] -mb-[2px]">
        {SelectedFlagComponent && (
          <span className="absolute items-center top-1/2 left-1/2 -translate-1/2 justify-center pointer-events-none">
            <SelectedFlagComponent
              title={selectedCountry.name}
              className="h-5 rounded-xs"
            />
            <div className="size-[0.7em] absolute top-2/3 -right-1/6 bg-white group-hover:opacity-100 transition-opacity opacity-55 rounded-full overflow-hidden">
              <IoIosArrowDropdownCircle className="size-full scale-125" />
            </div>
          </span>
        )}
        <select
          className="absolute size-full text-amber-50/0 border-2 input-focus-base"
          id="country-select"
          //   {...register("phoneNumber.countryCode")}
          value={phoneData?.countryCode}
          onChange={handleCountryChange}
        >
          {Object.entries(groupedCountries).map(([letter, countries]) => (
            <optgroup key={letter} label={letter}>
              {countries.map(({ name, phone, code }) => (
                <option key={code} value={code}>
                  {name} (+{phone})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <input
        placeholder={selectedCountry.example}
        className="w-full h-full rounded-r-md py-2 pl-2 focus:border-transparent focus:ring-0 focus:outline-none"
        onFocus={() => setInputFocused(true)}
        value={phoneData?.phoneNumber || ""}
        // {...register("phoneNumber.phoneNumber", {
        //   onBlur: () => {
        //     onBlur();
        //     setInputFocused(false);
        //   },
        // })}
        onBlur={() => {
          onBlur();
          setInputFocused(false);
        }}
        onChange={phoneNumberChangeHandler}
        ref={inputRef}
      />
    </div>
  );
};

export default PhoneInput;
