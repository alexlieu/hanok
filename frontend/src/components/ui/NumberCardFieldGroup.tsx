import { Description, FieldGroup, FieldGroupError } from "./aria/Field";
import { createLabel } from "./aria/utils/createLabel";
import { memo, ReactNode, useState } from "react";
import { tv } from "tailwind-variants";
import VisaSymbol from "../../assets/checkout_logos/visa.svg?react";
import MasterCardSymbol from "../../assets/checkout_logos/mastercard.svg?react";
import AmexSymbol from "../../assets/checkout_logos/amex.svg?react";

export interface NumberCardFieldGroupProps {
  cardNoField: ReactNode;
  expirationField: ReactNode;
  cvvField: ReactNode;
  isRequired?: boolean;
  description?: string;
  isInvalid?: boolean;
  errorMessage?: string[];
}

const cellStyles = tv({
  base: "relative border-2 border-brand-colour-5 focus-within:outline-brand-colour-4 focus-within:outline-2 focus-within:-outline-offset-1",
  variants: {
    isInvalid: { true: "border-error-red outline-hidden" },
  },
});

const logoStyles = tv({
  base: "h-9/10 w-auto border border-stone-200 rounded p-[1px]",
});

function NumberCardFieldGroup({
  cardNoField,
  expirationField,
  cvvField,
  description,
  isRequired,
  isInvalid,
  errorMessage,
}: NumberCardFieldGroupProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <FieldGroup
      className={"flex flex-col gap-2 border-0 items-start ring-0"}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      isInvalid={isInvalid}
    >
      {createLabel({
        label: "Card Details",
        isRequired,
        isInvalid,
        isFocused,
      })}
      <table className="border-collapse w-full table-fixed" role="presentation">
        <tbody>
          <tr>
            <td className={cellStyles({ isInvalid })} colSpan={2}>
              {cardNoField}
              <span className="absolute flex flex-row items-center justify-evenly h-full w-1/3 max-w-[130px] right-0 top-0">
                <MasterCardSymbol id="mastercard" className={logoStyles()} />
                <VisaSymbol id="visa" className={logoStyles()} />
                <AmexSymbol id="amex" className={logoStyles()} />
              </span>
            </td>
          </tr>
          <tr>
            <td className={cellStyles({ isInvalid })}>{expirationField}</td>
            <td className={cellStyles({ isInvalid })}>{cvvField}</td>
          </tr>
        </tbody>
      </table>
      {description && <Description>{description}</Description>}
      <FieldGroupError>
        {errorMessage && errorMessage.length > 0 && (
          <ul className="list-disc pl-5">
            {errorMessage.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}
      </FieldGroupError>
    </FieldGroup>
  );
}

export default memo(NumberCardFieldGroup);
