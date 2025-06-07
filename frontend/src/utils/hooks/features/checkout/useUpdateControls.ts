import { useState, useEffect, SetStateAction, Dispatch } from "react";

type DisabledFields = {
  sms: boolean;
  email: boolean;
};

const useUpdateControls = (
  isNumberValid: boolean,
  customerNumber: string,
  isEmailValid: boolean,
  customerEmail: string,
  emailUpdatesOn: boolean,
  setEmailUpdatesOn: Dispatch<SetStateAction<boolean>>,
  smsUpdatesOn: boolean,
  setSmsUpdatesOn: Dispatch<SetStateAction<boolean>>
) => {
  const [disabledFields, setDisabledFields] = useState<DisabledFields>({
    sms: true,
    email: true,
  });

  useEffect(() => {
    const validPhone = isNumberValid && customerNumber.length > 0;
    const validEmail = isEmailValid && customerEmail.length > 0;
    setDisabledFields({
      sms: !validPhone,
      email: !validEmail,
    });
  }, [isNumberValid, customerNumber, isEmailValid, customerEmail]);

  useEffect(() => {
    if (emailUpdatesOn && disabledFields.email) {
      setEmailUpdatesOn(false);
    }
  }, [emailUpdatesOn, setEmailUpdatesOn, disabledFields]);

  useEffect(() => {
    if (smsUpdatesOn && disabledFields.sms) {
      setSmsUpdatesOn(false);
    }
  }, [smsUpdatesOn, setSmsUpdatesOn, disabledFields]);

  return {
    disabledFields,
    emailUpdatesOn,
    smsUpdatesOn,
    setEmailUpdatesOn,
    setSmsUpdatesOn,
  };
};

export default useUpdateControls;
