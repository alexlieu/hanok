import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { CardInformation, CardSchema } from "../../schemas/CardSchema";
import { useEffect } from "react";
import BillingAddressForm from "./BillingAddressForm";

const CardDetailsForm: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<CardInformation>({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      cardNumber: "",
      expiration: "",
      cvv: "",
      holderName: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<CardInformation> = (data: CardInformation) => {
    console.log(data);
  };

  console.log(errors);

  useEffect(() => {
    const subscription = watch((data) => {
      console.log(data);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Card information</legend>
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
            />
            <input
              type="text"
              placeholder="MM/YY"
              inputMode="numeric"
              aria-label="Expiration"
              {...register("expiration")}
              onChange={expirationChangeHandler}
            />
            <input
              type="text"
              placeholder="CVV"
              inputMode="numeric"
              aria-label="CVV"
              {...register("cvv")}
              onChange={cvvChangeHandler}
            />
          </fieldset>
          <fieldset>
            <legend>Cardholder name</legend>
            <input
              type="text"
              placeholder="Full name on card"
              {...register("holderName")}
            />
          </fieldset>
          <button type="submit">Verify payment details</button>
        </form>
        <BillingAddressForm />
      </div>
    </>
  );
};

export default CardDetailsForm;
