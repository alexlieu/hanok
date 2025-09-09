import { Controller, useFormContext } from "react-hook-form";
import { PaymentFormFields } from "../../schemas/PaymentFormSchema";
import NumberCardFieldGroup from "../ui/NumberCardFieldGroup";
import { TextField } from "../ui/aria/TextField";

const CardDetailsForm: React.FC = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<PaymentFormFields>();

  console.log(errors);

  const cardNumberChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    const filteredInput = input.replace(/\D/g, "");
    const formattedInput = filteredInput.match(/.{1,4}/g)?.join(" ") || "";
    const finalValue =
      formattedInput.length <= 19
        ? formattedInput
        : formattedInput.substring(0, 19);
    setValue("cardNumber", finalValue);
  };

  const expirationChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    const filteredInput = input.replace(/\D/g, "");
    const finalValue =
      filteredInput.length === 0
        ? ""
        : filteredInput.length <= 2
        ? filteredInput
        : `${filteredInput.substring(0, 2)}/${filteredInput.substring(2, 4)}`;
    setValue("expiration", finalValue);
  };

  const cvvChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const filteredInput = input.replace(/\D/g, "");
    const finalValue =
      filteredInput.length <= 3 ? filteredInput : filteredInput.substring(0, 3);
    setValue("cvv", finalValue);
  };

  const errorMessages = [
    errors.cardNumber?.message,
    errors.expiration?.message,
    errors.cvv?.message,
  ].filter((msg): msg is string => !!msg);

  return (
    <>
      <fieldset>
        <legend title="Card details" />
        <div className="flex flex-col gap-4">
          <NumberCardFieldGroup
            cardNoField={
              <Controller
                name="cardNumber"
                control={control}
                render={({
                  field: { onChange, onBlur, value, ref },
                  // fieldState: { invalid, error },
                }) => (
                  <TextField
                    placeholder="1234 1234 1234 1234"
                    borderless="forCardNo"
                    inputRef={ref}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    isRequired
                    aria-label="Card number field"
                    maxLength={19}
                    // isInvalid={invalid}
                    // errorMessage={error?.message}
                  />
                )}
              />
            }
            expirationField={
              <Controller
                name="expiration"
                control={control}
                render={({
                  field: { onChange, onBlur, value, ref },
                  // fieldState: { invalid, error },
                }) => (
                  <TextField
                    placeholder="MM/YY"
                    borderless="default"
                    inputRef={ref}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    isRequired
                    aria-label="Card expiration date field"
                    maxLength={5}
                    // isInvalid={invalid}
                    // errorMessage={error?.message}
                  />
                )}
              />
            }
            cvvField={
              <Controller
                name="cvv"
                control={control}
                render={({
                  field: { onChange, onBlur, value, ref },
                  // fieldState: { invalid, error },
                }) => (
                  <TextField
                    placeholder="CVV"
                    borderless="default"
                    inputRef={ref}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    isRequired
                    aria-label="Card CVV field"
                    maxLength={3}
                    // isInvalid={invalid}
                    // errorMessage={error?.message}
                  />
                )}
              />
            }
            isInvalid={!!(errors.cardNumber || errors.expiration || errors.cvv)}
            errorMessage={errorMessages}
          />
          <TextField label="Holder Name" maxLength={50} />
        </div>
      </fieldset>
    </>
  );
};

export default CardDetailsForm;
