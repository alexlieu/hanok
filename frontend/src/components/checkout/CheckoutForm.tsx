// import { useCallback, useState, useEffect } from "react";
import ContactNumberInput from "./ContactNumberInput";
import DateInput from "./DateInput";
import Checkbox from "../ui/Checkbox";
import useCheckoutValidation, {
  ValidationMessageValue,
} from "../../utils/hooks/features/checkout/useCheckoutValidation";
import useUpdateControls from "../../utils/hooks/features/checkout/useUpdateControls";
import { ValidationErrors } from "../../utils/hooks/features/checkout/useCheckoutValidation";
import { useCallback } from "react";
import NameInput from "./NameInput";
import InputErrorMessage from "./InputErrorMessage";

const CheckoutForm: React.FC = () => {
  const {
    // firstName,
    handleFirstNameChange,
    showFirstNameErrorMessage,
    handleFirstNameBlur,
    // lastName,
    handleLastNameChange,
    showLastNameErrorMessage,
    handleLastNameBlur,
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
    // setShowEmailErrorMessage,
    showContactErrorMessage,
    // setShowContactErrorMessage,
    showUpdateChoiceErrorMessage,
    // setShowUpdateChoiceErrorMessage,
    // pickupDate,
    handleDateChange,
    emailUpdatesOn,
    setEmailUpdatesOn,
    smsUpdatesOn,
    setSmsUpdatesOn,
    handleEmailUpdates,
    handleSmsUpdates,
    updateFieldError,
    validationErrors,
    // setValidationErrors,
    validateForm,
  } = useCheckoutValidation();

  const { disabledFields } = useUpdateControls(
    isNumberValid,
    customerNumber,
    isEmailValid,
    customerEmail,
    emailUpdatesOn,
    setEmailUpdatesOn,
    smsUpdatesOn,
    setSmsUpdatesOn
  );

  const updatePhoneError = useCallback(
    (message: ValidationMessageValue) => {
      updateFieldError("phone", message);
    },
    [updateFieldError]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      console.log("Form is valid");
    } else {
      console.log("Form has errors");
    }
  };

  const legendStyling = "text-xl font-medium tracking-wide";

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <fieldset>
        <legend className={`${legendStyling}`}>Contact details</legend>
        <NameInput
          label="First Name"
          fieldName="first-name"
          onChange={handleFirstNameChange}
          showError={showFirstNameErrorMessage}
          onBlur={handleFirstNameBlur}
          errorMessage={validationErrors.firstName}
        />
        <NameInput
          label="Last Name"
          fieldName="last-name"
          onChange={handleLastNameChange}
          showError={showLastNameErrorMessage}
          onBlur={handleLastNameBlur}
          errorMessage={validationErrors.lastName}
        />
        <InputErrorMessage
          id="contact-error"
          show={showContactErrorMessage}
          error={validationErrors.contact}
        />
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleEmailInputChange}
            onBlur={handleEmailInputBlur}
            aria-invalid={
              !isEmailValid &&
              validationErrors.email.length > 0 &&
              showEmailErrorMessage
            }
            aria-describedby={
              !isEmailValid && validationErrors.email && showEmailErrorMessage
                ? "customer_email-error"
                : undefined
            }
          />
          <InputErrorMessage
            id="email-error"
            show={showEmailErrorMessage}
            valid={isEmailValid}
            error={validationErrors.email}
          />
        </div>
        <ContactNumberInput
          onNumberChange={handlePhoneChange}
          required={false}
          validationError={validationErrors.phone}
          updateParentPhoneError={updatePhoneError}
          showErrorMessage={showPhoneErrorMessage}
          setShowErrorMessage={setShowPhoneErrorMessage}
        />
      </fieldset>
      <fieldset className="flex flex-col">
        <legend className={`${legendStyling}`}>Order preferences</legend>
        <DateInput onDateChange={handleDateChange} />
        <p>How would you like to receive updates?</p>
        <InputErrorMessage
          id="updates-error"
          show={showUpdateChoiceErrorMessage}
          error={validationErrors.updates}
        />
        <Checkbox
          name="sms-updates"
          value="sms-updates"
          handleChange={handleSmsUpdates}
          disabled={disabledFields.sms}
          checked={smsUpdatesOn}
          label="SMS Updates"
        />
        <Checkbox
          name="email-updates"
          value="email-updates"
          handleChange={handleEmailUpdates}
          disabled={disabledFields.email}
          checked={emailUpdatesOn}
          label="Email Updates"
        />
        <label htmlFor="special-instructions">Special instructions</label>
        <input type="text" name="special-instructions" />
      </fieldset>
      <div className="pt-10">
        {Object.keys(validationErrors).map((k) => {
          const errorMessage = validationErrors[k as keyof ValidationErrors];
          return errorMessage ? <p key={`${k}-error`}>{errorMessage}</p> : null;
        })}
      </div>
      <button type="submit">Place Order</button>
      <button type="reset">Clear form</button>
    </form>
  );
};

export default CheckoutForm;
