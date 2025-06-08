import { useState, useCallback } from "react";

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export type ValidationErrors = {
  contact: string;
  firstName: string;
  lastName: string;
  date: string;
  updates: string;
  phone: string;
  email: string;
};

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required.",
  REQUIRED_FIRST_NAME: "First name is required.",
  REQUIRED_LAST_NAME: "Last name is required.",
  REQUIRED_NUMBER: "Phone number is required",
  REQUIRED_CONTACT: "Email or phone number is required.",
  REQUIRED_UPDATE_METHOD: "Please choose your preferred method of contact.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_NUMBER: "Please enter a valid phone number.",
  VALID: "",
} as const;

export type ValidationMessageValue =
  (typeof VALIDATION_MESSAGES)[keyof typeof VALIDATION_MESSAGES];

type TouchedFields = { [K in keyof ValidationErrors]?: boolean };

const useCheckoutValidation = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [customerNumber, setCustomerNumber] = useState<string>("");
  const [isNumberValid, setIsNumberValid] = useState(false);
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    contact: "",
    firstName: "",
    lastName: "",
    date: "",
    updates: "",
    phone: "",
    email: "",
  });
  const [emailUpdatesOn, setEmailUpdatesOn] = useState(false);
  const [smsUpdatesOn, setSmsUpdatesOn] = useState(false);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});

  const blurTimeout = 85;

  const updateFieldError = useCallback(
    (fieldName: keyof ValidationErrors, message: ValidationMessageValue) => {
      setValidationErrors((prevState) => ({
        ...prevState,
        [fieldName]: message,
      }));
    },
    []
  );

  const markFieldAsTouched = useCallback(
    (fieldName: keyof ValidationErrors) => {
      setTouchedFields((prevState) => ({ ...prevState, [fieldName]: true }));
    },
    []
  );

  const handleFirstNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(event.target.value);
      updateFieldError("firstName", VALIDATION_MESSAGES.VALID);
    },
    [updateFieldError]
  );

  const handleFirstNameBlur = useCallback(() => {
    markFieldAsTouched("firstName");
    setTimeout(() => {
      if (firstName.length < 1) {
        updateFieldError("firstName", VALIDATION_MESSAGES.REQUIRED_FIRST_NAME);
      }
    }, blurTimeout);
  }, [firstName, markFieldAsTouched, updateFieldError]);

  const handleLastNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLastName(event.target.value);
      updateFieldError("lastName", VALIDATION_MESSAGES.VALID);
    },
    [updateFieldError]
  );

  const handleLastNameBlur = useCallback(() => {
    markFieldAsTouched("lastName");
    setTimeout(() => {
      if (lastName.length < 1) {
        updateFieldError("lastName", VALIDATION_MESSAGES.REQUIRED_LAST_NAME);
      }
    }, blurTimeout);
  }, [lastName, markFieldAsTouched, updateFieldError]);

  const handleEmailInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const email = event.target.value;
      setCustomerEmail(email);
      setIsEmailValid(EMAIL_REGEX.test(email));
      updateFieldError("email", VALIDATION_MESSAGES.VALID);
      updateFieldError("contact", VALIDATION_MESSAGES.VALID);
    },
    [updateFieldError]
  );

  const handleEmailInputBlur = useCallback(() => {
    markFieldAsTouched("email");

    const currentEmailIsValid = EMAIL_REGEX.test(customerEmail);
    setIsEmailValid(currentEmailIsValid);

    setTimeout(() => {
      if (!currentEmailIsValid && customerEmail.length > 0) {
        updateFieldError("email", VALIDATION_MESSAGES.INVALID_EMAIL);
      }
    }, blurTimeout);
  }, [customerEmail, markFieldAsTouched, updateFieldError]);

  const handlePhoneChange = useCallback(
    (phoneNumber: string, isValid: boolean) => {
      setCustomerNumber(phoneNumber);
      setIsNumberValid(isValid);
      updateFieldError("phone", VALIDATION_MESSAGES.VALID);
      updateFieldError("contact", VALIDATION_MESSAGES.VALID);
    },
    [updateFieldError]
  );

  const handlePhoneBlur = useCallback(() => {
    markFieldAsTouched("phone");
    setTimeout(() => {
      if (customerNumber && !isNumberValid) {
        updateFieldError("phone", VALIDATION_MESSAGES.INVALID_NUMBER);
      }
    }, blurTimeout);
  }, [
    customerNumber,
    isNumberValid,
    isFormSubmitted,
    updateFieldError,
    markFieldAsTouched,
  ]);

  const handleDateChange = useCallback(
    (pickupDate: string) => {
      setPickupDate(pickupDate);
      updateFieldError("date", VALIDATION_MESSAGES.VALID);
    },
    [updateFieldError]
  );

  const handleEmailUpdates = useCallback(() => {
    setEmailUpdatesOn((prevState) => !prevState);
    updateFieldError("updates", VALIDATION_MESSAGES.VALID);
  }, [updateFieldError]);

  const handleSmsUpdates = useCallback(() => {
    setSmsUpdatesOn((prevState) => !prevState);
    updateFieldError("updates", VALIDATION_MESSAGES.VALID);
  }, [updateFieldError]);

  const validateForm = useCallback(() => {
    setIsFormSubmitted(true);
    const newErrors: ValidationErrors = {
      contact: VALIDATION_MESSAGES.VALID,
      firstName: VALIDATION_MESSAGES.VALID,
      lastName: VALIDATION_MESSAGES.VALID,
      updates: VALIDATION_MESSAGES.VALID,
      phone: VALIDATION_MESSAGES.VALID,
      email: VALIDATION_MESSAGES.VALID,
      date: VALIDATION_MESSAGES.VALID,
    };

    let formIsValid = true;

    if (!firstName) {
      newErrors.firstName = VALIDATION_MESSAGES.REQUIRED_FIRST_NAME;
      formIsValid = false;
    }
    if (!lastName) {
      newErrors.lastName = VALIDATION_MESSAGES.REQUIRED_LAST_NAME;
      formIsValid = false;
    }
    if (customerEmail.length > 0 && !isEmailValid) {
      newErrors.email = VALIDATION_MESSAGES.INVALID_EMAIL;
      formIsValid = false;
    }
    if (customerNumber.length > 0 && !isNumberValid) {
      newErrors.phone = VALIDATION_MESSAGES.INVALID_NUMBER;
      formIsValid = false;
    }
    if (!emailUpdatesOn && !smsUpdatesOn) {
      newErrors.updates = VALIDATION_MESSAGES.REQUIRED_CONTACT;
      formIsValid = false;
    }
    if (customerEmail.length < 1 && customerNumber.length < 1) {
      newErrors.contact = VALIDATION_MESSAGES.REQUIRED_CONTACT;
      formIsValid = false;
    }
    setValidationErrors(newErrors);
    return formIsValid;
  }, [
    firstName,
    lastName,
    customerEmail,
    customerNumber,
    isEmailValid,
    isNumberValid,
    emailUpdatesOn,
    smsUpdatesOn,
  ]);

  const resetForm = useCallback(() => {
    setFirstName("");
    setLastName("");
    setCustomerNumber("");
    setIsNumberValid(false);
    setCustomerEmail("");
    setIsEmailValid(false);
    setPickupDate("");
    setEmailUpdatesOn(false);
    setSmsUpdatesOn(false);
    setValidationErrors({
      contact: "",
      firstName: "",
      lastName: "",
      date: "",
      updates: "",
      phone: "",
      email: "",
    });
    setTouchedFields({}); // Reset touched fields!
    setIsFormSubmitted(false); // Reset form submission flag
  }, []);

  return {
    firstName,
    handleFirstNameChange,
    handleFirstNameBlur,
    lastName,
    handleLastNameChange,
    handleLastNameBlur,
    customerNumber,
    handlePhoneChange,
    handlePhoneBlur,
    isNumberValid,
    customerEmail,
    handleEmailInputChange,
    isEmailValid,
    handleEmailInputBlur,
    pickupDate,
    handleDateChange,
    emailUpdatesOn,
    setEmailUpdatesOn,
    smsUpdatesOn,
    setSmsUpdatesOn,
    handleEmailUpdates,
    handleSmsUpdates,
    updateFieldError,
    validationErrors,
    setValidationErrors,
    validateForm,
    isFormSubmitted,
    resetForm,
    touchedFields,
    setTouchedFields,
  };
};

export default useCheckoutValidation;
