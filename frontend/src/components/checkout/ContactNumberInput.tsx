import { useCallback, useEffect, useRef, useState, memo } from "react";
import { CountryCode } from "libphonenumber-js";
import { parsePhoneNumber } from "libphonenumber-js/min";
import InputErrorMessage from "./InputErrorMessage";
import {
  VALIDATION_MESSAGES,
  ValidationMessageValue,
} from "../../utils/hooks/features/checkout/useCheckoutValidation";

type ValidationResult = {
  isValid: boolean;
  errorMessage: ValidationMessageValue;
  formattedDisplay: string;
  e164value: string;
  inputValueToSet: string;
};

type ContactNumberInputProps = {
  initialNumber?: string;
  defaultCountryCode?: CountryCode;
  onNumberChange: (contactNo: string, isValid: boolean) => void;
  label?: string;
  id?: string;
  required?: boolean;
  validationError: string;
  updateParentPhoneError: (message: ValidationMessageValue) => void;
  showError: boolean;
  onBlur: () => void;
};

const MIN_GB_PHONE_LENGTH_TO_PARSE = 7;

const ContactNumberInput: React.FC<ContactNumberInputProps> = ({
  initialNumber = "",
  defaultCountryCode = "GB",
  onNumberChange,
  label = "Phone Number",
  id = "phone-number-input",
  required = false,
  validationError,
  updateParentPhoneError,
  showError,
  onBlur,
}) => {
  const [isValid, setIsValid] = useState(true);
  //   const [errorMessage, updateParentPhoneError] = useState("");
  const [formattedDisplay, setFormattedDisplay] = useState(initialNumber);
  //   const [showErrorMessage, setShowErrorMessage] = useState(false);

  const onNumberChangeRef = useRef(onNumberChange);

  useEffect(() => {
    onNumberChangeRef.current = onNumberChange;
  }, [onNumberChange]);

  const validateNumber = useCallback(
    (numberToParse: string): ValidationResult => {
      const cleanedInput = numberToParse.replace(/\D/g, "");

      if (!cleanedInput) {
        return {
          isValid: !required,
          errorMessage: required ? VALIDATION_MESSAGES.REQUIRED_NUMBER : "",
          formattedDisplay: "",
          e164value: "",
          inputValueToSet: "",
        };
      }

      if (cleanedInput.length < MIN_GB_PHONE_LENGTH_TO_PARSE) {
        return {
          isValid: false,
          errorMessage: VALIDATION_MESSAGES.INVALID_NUMBER,
          formattedDisplay: numberToParse,
          e164value: numberToParse,
          inputValueToSet: numberToParse,
        };
      }

      try {
        const phoneNumberParsed = parsePhoneNumber(cleanedInput, {
          defaultCountry: defaultCountryCode,
        });

        if (phoneNumberParsed && phoneNumberParsed.isValid()) {
          return {
            isValid: true,
            errorMessage: "",
            formattedDisplay: phoneNumberParsed.formatNational(),
            e164value: phoneNumberParsed.format("E.164"),
            inputValueToSet: phoneNumberParsed.format("E.164"),
          };
        } else {
          return {
            isValid: false,
            errorMessage: VALIDATION_MESSAGES.INVALID_NUMBER,
            formattedDisplay: numberToParse,
            e164value: numberToParse,
            inputValueToSet: numberToParse,
          };
        }
      } catch (error) {
        console.error("Error parsing phone number: ", error);
        return {
          isValid: false,
          errorMessage: VALIDATION_MESSAGES.INVALID_NUMBER,
          formattedDisplay: numberToParse,
          e164value: numberToParse,
          inputValueToSet: numberToParse,
        };
      }
    },
    [defaultCountryCode, required]
  );

  useEffect(() => {
    if (initialNumber) {
      const result = validateNumber(initialNumber);
      setIsValid(result.isValid);
      updateParentPhoneError(result.errorMessage);
      setFormattedDisplay(result.formattedDisplay);
      onNumberChangeRef.current(result.e164value, result.isValid);
    } else {
      setIsValid(true);
      updateParentPhoneError("");
      setFormattedDisplay("");
    }
  }, [initialNumber, validateNumber, updateParentPhoneError, required]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const result = validateNumber(event.target.value);
      setIsValid(result.isValid);
      setFormattedDisplay(result.formattedDisplay);
      onNumberChangeRef.current(result.e164value, result.isValid);
    },
    [validateNumber]
  );

  const errorId = `${id}-error`;

  return (
    <div className={"flex flex-row"}>
      <label htmlFor={id}>{label}</label>
      <input
        type="tel"
        id={id}
        name={id}
        value={formattedDisplay}
        onChange={handleChange}
        onBlur={onBlur}
        className={!isValid ? "input-invalid" : ""}
        required={required}
        aria-invalid={!isValid}
        aria-describedby={!isValid && validationError ? errorId : undefined}
      />
      <InputErrorMessage
        id={errorId}
        show={showError}
        error={validationError}
      />
    </div>
  );
};

export default memo(ContactNumberInput);
