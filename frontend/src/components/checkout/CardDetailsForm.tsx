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
// import { FaRegCreditCard } from "react-icons/fa6";
// import { LuCircleX } from "react-icons/lu";

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
                      <ul className="absolute flex flex-row justify-center items-center h-full gap-3 top-0 right-2">
                        <AnimatePresence>
                          {presentLogos.map((logo) => (
                            <motion.li
                              key={logo}
                              layout
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
                        </AnimatePresence>
                      </ul>
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
