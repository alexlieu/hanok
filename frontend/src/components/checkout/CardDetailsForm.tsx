import { useFormContext } from "react-hook-form";
import { PaymentFormFields } from "../../schemas/PaymentFormSchema";
import VisaSymbol from "../../assets/checkout_logos/visa_symbol.svg?react";
import MasterCardSymbol from "../../assets/checkout_logos/mastercard_symbol.svg?react";
import AmexSymbol from "../../assets/checkout_logos/amex_symbol.svg?react";

const CardDetailsForm: React.FC = () => {
  const {
    register,
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

  const logoStyling =
    "h-5 sm:h-6 w-auto border border-stone-200 rounded p-[1px]";

  return (
    <div className="mx-auto">
      <fieldset>
        <legend>Card information</legend>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="1234 1234 1234 1234"
            inputMode="numeric"
            autoCorrect="false"
            spellCheck="false"
            autoComplete="false"
            aria-label="Card Number"
            {...register("cardNumber", {})}
            onChange={cardNumberChangeHandler}
            className={`
              w-full h-auto pr-[80px] sm:pr-[120px] rounded-tr-md rounded-tl-md form-input-base
              ${errors.cardNumber ? "border-red-600" : "border-gray-300"}
            `}
          />
          <div
            className={`
              absolute right-2 top-1/2 -translate-y-1/2
              flex flex-row gap-[0.5em] sm:gap-[0.75em]
            `}
          >
            <MasterCardSymbol id="mastercard" className={logoStyling} />
            <VisaSymbol id="visa" className={logoStyling} />
            <AmexSymbol id="amex" className={logoStyling} />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <input
            type="text"
            placeholder="MM/YY"
            inputMode="numeric"
            aria-label="Expiration"
            {...register("expiration")}
            onChange={expirationChangeHandler}
            className="flex-1 rounded-bl-md mt-[-2px] mr-[-2px] form-input-base"
          />
          <input
            type="text"
            placeholder="CVV"
            inputMode="numeric"
            aria-label="CVV"
            {...register("cvv")}
            onChange={cvvChangeHandler}
            className="flex-1 rounded-br-md mt-[-2px] form-input-base"
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>Cardholder name</legend>
        <input
          type="text"
          placeholder="Full name on card"
          {...register("holderName")}
          className="rounded-md w-full focus:z-10 form-input-base"
        />
      </fieldset>
    </div>
  );
};

export default CardDetailsForm;
