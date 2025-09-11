import { Controller, useFormContext } from "react-hook-form";
import { PaymentFormFields } from "../../schemas/PaymentFormSchema";
import { TextField } from "../ui/aria/TextField";
import { tv } from "tailwind-variants";
import { getIssuingBank, issuingBank } from "../../schemas/CardSchema";
import Visa from "../../assets/checkout_logos/visa.svg?react";
import Mastercard from "../../assets/checkout_logos/mastercard.svg?react";
import Amex from "../../assets/checkout_logos/amex.svg?react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const CardDetailsForm: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<PaymentFormFields>();

  console.log(errors);

  const logoStyles = tv({
    base: "",
  });

  const [issuingBank, setIssuingBank] = useState<issuingBank>(undefined);

  const MotionVisa = motion.create(Visa);
  const MotionMastercard = motion.create(Mastercard);
  const MotionAmex = motion.create(Amex);

  return (
    <>
      <fieldset>
        <legend title="Card details" />
        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="holderName"
            control={control}
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error },
            }) => {
              return (
                <TextField
                  label="Holder Name"
                  isRequired
                  inputRef={ref}
                  maxLength={50}
                  className={"col-span-2"}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              );
            }}
          />
          <Controller
            name="cardNumber"
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => {
              const handleCleanCardNumber = (rawInput: string) => {
                const filteredInput = rawInput.replace(/\D/g, "");
                const formattedInput =
                  filteredInput.match(/.{1,4}/g)?.join(" ") || "";
                const finalValue =
                  formattedInput.length <= 19
                    ? formattedInput
                    : formattedInput.substring(0, 19);
                setIssuingBank(getIssuingBank(finalValue));
                onChange(finalValue);
              };
              return (
                <TextField
                  placeholder="1234 1234 1234 1234"
                  label="Card number"
                  inputRef={ref}
                  value={value}
                  onChange={handleCleanCardNumber}
                  onBlur={onBlur}
                  isRequired
                  aria-label="Card number field"
                  maxLength={19}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  className={"col-span-2"}
                  contentInField={(() => {
                    const logoVariants = {
                      hidden: { opacity: 0, translateY: 5 },
                      visible: { opacity: 1, translateY: 0 },
                      exit: { opacity: 0, translateY: 5 },
                    };
                    return (
                      <AnimatePresence>
                        <span className="absolute flex flex-row items-center justify-between h-full gap-2 top-0 right-2">
                          {(issuingBank === "Visa" ||
                            issuingBank === undefined) && (
                            <MotionVisa
                              id="visa"
                              key="visa"
                              variants={logoVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className={logoStyles()}
                            />
                          )}
                          {(issuingBank === "Mastercard" ||
                            issuingBank === undefined) && (
                            <MotionMastercard
                              id="mastercard"
                              key="mastercard"
                              layout="position"
                              initial={{ opacity: 0, translateY: 5 }}
                              animate={{ opacity: 1, translateY: 0 }}
                              exit={{ opacity: 0, translateY: 5 }}
                              className={logoStyles()}
                            />
                          )}
                          {(issuingBank === "Amex" ||
                            issuingBank === undefined) && (
                            <MotionAmex
                              id="amex"
                              key="amex"
                              layout="position"
                              initial={{ opacity: 0, translateY: 5 }}
                              animate={{ opacity: 1, translateY: 0 }}
                              exit={{ opacity: 0, translateY: 5 }}
                              className={logoStyles()}
                            />
                          )}
                        </span>
                      </AnimatePresence>
                    );
                  })()}
                />
              );
            }}
          />
          <Controller
            name="expiration"
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => {
              const handleFormatExpiration = (rawInput: string) => {
                const filteredInput = rawInput.replace(/\D/g, "");
                const finalValue =
                  filteredInput.length === 0
                    ? ""
                    : filteredInput.length <= 2
                    ? filteredInput
                    : `${filteredInput.substring(
                        0,
                        2
                      )}/${filteredInput.substring(2, 4)}`;
                onChange(finalValue);
              };
              return (
                <TextField
                  label="Expiration date"
                  placeholder="MM/YY"
                  inputRef={ref}
                  value={value}
                  onChange={handleFormatExpiration}
                  onBlur={onBlur}
                  isRequired
                  aria-label="Card expiration date field"
                  maxLength={5}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              );
            }}
          />
          <Controller
            name="cvv"
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { invalid, error },
            }) => {
              const handleFormatCVV = (rawInput: string) => {
                onChange(rawInput.replace(/\D/g, ""));
              };
              return (
                <TextField
                  label="CVV"
                  placeholder="CVV"
                  inputRef={ref}
                  value={value}
                  onChange={handleFormatCVV}
                  onBlur={onBlur}
                  isRequired
                  aria-label="Card CVV field"
                  maxLength={4}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              );
            }}
          />
        </div>
      </fieldset>
    </>
  );
};

export default CardDetailsForm;
