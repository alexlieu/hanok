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
  const [showFirstNameErrorMessage, setShowFirstNameErrorMessage] =
    useState(false);
  const [showLastNameErrorMessage, setShowLastNameErrorMessage] =
    useState(false);
  const [showPhoneErrorMessage, setShowPhoneErrorMessage] = useState(false);
  const [showEmailErrorMessage, setShowEmailErrorMessage] = useState(false);
  const [showContactErrorMessage, setShowContactErrorMessage] = useState(false);
  const [showUpdateChoiceErrorMessage, setShowUpdateChoiceErrorMessage] =
    useState(false);

  const updateFieldError = useCallback(
    (fieldName: keyof ValidationErrors, message: ValidationMessageValue) => {
      setValidationErrors((prevState) => ({
        ...prevState,
        [fieldName]: message,
      }));
    },
    []
  );

  const handleFirstNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowFirstNameErrorMessage(false);
      updateFieldError("firstName", "");
      const input = event.target.value;
      setFirstName(input);
    },
    [updateFieldError]
  );

  const handleFirstNameBlur = () => {
    setShowFirstNameErrorMessage(true);
    if (firstName.length < 1) {
      updateFieldError("firstName", VALIDATION_MESSAGES.REQUIRED_FIRST_NAME);
    } else {
      updateFieldError("firstName", "");
    }
  };

  const handleLastNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowLastNameErrorMessage(false);
      updateFieldError("lastName", "");
      const input = event.target.value;
      setLastName(input);
    },
    [updateFieldError]
  );

  const handleLastNameBlur = () => {
    setShowLastNameErrorMessage(true);
    if (lastName.length < 1) {
      updateFieldError("lastName", VALIDATION_MESSAGES.REQUIRED_LAST_NAME);
    } else {
      updateFieldError("lastName", "");
    }
  };

  const handleEmailInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowContactErrorMessage(false);
      const email = event.target.value;
      setCustomerEmail(email);
      setIsEmailValid(EMAIL_REGEX.test(email));
      updateFieldError("email", "");
      setShowEmailErrorMessage(false);
    },
    [updateFieldError]
  );

  const handleEmailInputBlur = useCallback(() => {
    setShowEmailErrorMessage(true);

    const currentEmailIsValid = EMAIL_REGEX.test(customerEmail);
    setIsEmailValid(currentEmailIsValid);

    if (!currentEmailIsValid && customerEmail.length > 0) {
      updateFieldError("email", VALIDATION_MESSAGES.INVALID_EMAIL);
    } else {
      updateFieldError("email", "");
    }
  }, [customerEmail, updateFieldError]);

  const handlePhoneChange = (phoneNumber: string, isValid: boolean) => {
    setCustomerNumber(phoneNumber);
    setIsNumberValid(isValid);
    console.log("Phone number in parent:", phoneNumber, "Is Valid:", isValid);
  };

  const validateContactMethod = useCallback(() => {
    if (customerEmail.length < 1 && customerNumber.length < 1) {
      updateFieldError("contact", VALIDATION_MESSAGES.REQUIRED_CONTACT);
      return false;
    } else {
      updateFieldError("contact", "");
      return true;
    }
  }, [customerEmail, customerNumber, updateFieldError]);

  const validateUpdateChoice = useCallback(() => {
    if (!emailUpdatesOn && !smsUpdatesOn) {
      updateFieldError("updates", VALIDATION_MESSAGES.REQUIRED_UPDATE_METHOD);
      return false;
    } else {
      updateFieldError("updates", "");
      return true;
    }
  }, [emailUpdatesOn, smsUpdatesOn, updateFieldError]);

  const handleDateChange = useCallback((pickupDate: string) => {
    setPickupDate(pickupDate);
  }, []);

  const handleEmailUpdates = () => {
    setShowUpdateChoiceErrorMessage(false);
    setEmailUpdatesOn((prevState) => !prevState);
  };

  const handleSmsUpdates = () => {
    setShowUpdateChoiceErrorMessage(false);
    setSmsUpdatesOn((prevState) => !prevState);
  };

  const validateForm = () => {
    if (!firstName) {
      updateFieldError("firstName", VALIDATION_MESSAGES.REQUIRED_FIRST_NAME);
    }
    if (!lastName) {
      updateFieldError("lastName", VALIDATION_MESSAGES.REQUIRED_LAST_NAME);
    }
    setShowFirstNameErrorMessage(true);
    setShowLastNameErrorMessage(true);
    setShowEmailErrorMessage(true);
    setShowPhoneErrorMessage(true);
    setShowContactErrorMessage(true);
    setShowUpdateChoiceErrorMessage(true);
    const isContactMethodValid = validateContactMethod();
    const isUpdateChoiceValid = validateUpdateChoice();
    const anyValidationErrors = Object.values(validationErrors).every(
      (error) => error === ""
    );
    return (
      anyValidationErrors &&
      isContactMethodValid &&
      isUpdateChoiceValid &&
      firstName &&
      lastName
    );
  };

  return {
    firstName,
    handleFirstNameChange,
    handleFirstNameBlur,
    showFirstNameErrorMessage,
    lastName,
    handleLastNameChange,
    handleLastNameBlur,
    showLastNameErrorMessage,
    customerNumber,
    handlePhoneChange,
    isNumberValid,
    showPhoneErrorMessage,
    setShowPhoneErrorMessage,
    customerEmail,
    handleEmailInputChange,
    isEmailValid,
    handleEmailInputBlur,
    showEmailErrorMessage,
    setShowEmailErrorMessage,
    showContactErrorMessage,
    setShowContactErrorMessage,
    showUpdateChoiceErrorMessage,
    setShowUpdateChoiceErrorMessage,
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
  };
};

export default useCheckoutValidation;
