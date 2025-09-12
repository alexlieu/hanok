import { Controller, useFormContext } from "react-hook-form";
import { PaymentFormFields } from "../../schemas/PaymentFormSchema";
import { TextField } from "../ui/aria/TextField";
import { tv } from "tailwind-variants";
import { getIssuingBank, issuingBank } from "../../schemas/CardSchema";
import Visa from "../../assets/checkout_logos/visa.svg?react";
import Mastercard from "../../assets/checkout_logos/mastercard.svg?react";
import Amex from "../../assets/checkout_logos/amex.svg?react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaRegCreditCard } from "react-icons/fa6";
import { LuCircleX } from "react-icons/lu";

const allLogos = ["Visa", "Mastercard", "Amex"];

const CardDetailsForm: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<PaymentFormFields>();

  console.log(errors);

  const logoStyles = tv({
    base: "",
  });

  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  const [issuingBank, setIssuingBank] = useState<issuingBank>(undefined);

  const presentLogos =
    issuingBank === undefined
      ? allLogos
      : allLogos.filter((logo) => logo === issuingBank);

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
                const len = filteredInput.length;
                const localIssuingBank = getIssuingBank(filteredInput);
                let formattedInput;
                if (localIssuingBank === "Amex") {
                  formattedInput = "";
                  if (len > 0) {
                    formattedInput += filteredInput.substring(0, 4);
                    if (len > 4) {
                      formattedInput += " " + filteredInput.substring(4, 10);
                    }
                    if (len > 10) {
                      formattedInput += " " + filteredInput.substring(10, 15);
                    }
                  }
                } else {
                  formattedInput =
                    filteredInput.match(/.{1,4}/g)?.join(" ") || "";
                }
                setIssuingBank(localIssuingBank);
                onChange(formattedInput);
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
                  maxLength={issuingBank === "Amex" ? 17 : 19}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  className={"col-span-2"}
                  contentInField={(() => {
                    const duration = 0.08;
                    const logoVariants = {
                      hidden: {
                        opacity: 0,
                        translateY: 5,
                        transition: { duration: duration },
                      },
                      visible: {
                        opacity: 1,
                        translateY: 0,
                        transition: { duration: duration },
                      },
                      exit: {
                        opacity: 0,
                        translateY: 5,
                        transition: { duration: duration },
                      },
                    };
                    return (
                      <AnimatePresence mode="wait">
                        {invalid && value === "" ? (
                          <motion.span
                            className="absolute flex justify-center items-center right-3 top-0 h-full"
                            key="invalid"
                            variants={logoVariants}
                            initial={isInitialMount ? false : "hidden"}
                            animate="visible"
                            exit="exit"
                          >
                            <FaRegCreditCard
                              fill="var(--color-error-red)"
                              className="scale-150 relative"
                            />
                            <LuCircleX
                              stroke="var(--color-error-red)"
                              strokeWidth={3}
                              className="absolute scale-70 bg-default-bg rounded-full -right-2 bottom-1"
                            />
                          </motion.span>
                        ) : (
                          <motion.div
                            key={issuingBank || "all"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute h-full top-0 right-2"
                          >
                            <ul className="flex flex-row justify-center items-center h-full gap-3">
                              {presentLogos.map((logo) => (
                                <motion.li
                                  key={logo}
                                  variants={logoVariants}
                                  initial={isInitialMount ? false : "hidden"}
                                  animate="visible"
                                  exit="exit"
                                >
                                  {logo === "Visa" && (
                                    <Visa className={logoStyles()} />
                                  )}
                                  {logo === "Mastercard" && (
                                    <Mastercard className={logoStyles()} />
                                  )}
                                  {logo === "Amex" && (
                                    <Amex className={logoStyles()} />
                                  )}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
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
