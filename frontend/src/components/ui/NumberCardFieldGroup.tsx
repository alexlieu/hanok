import { RefCallBack } from "react-hook-form";
import { FieldGroup } from "./aria/Field";
import { TextField } from "./aria/TextField";
import { createLabel } from "./aria/utils/createLabel";
import { useState } from "react";
import { tv } from "tailwind-variants";
import VisaSymbol from "../../assets/checkout_logos/visa_symbol.svg?react";
import MasterCardSymbol from "../../assets/checkout_logos/mastercard_symbol.svg?react";
import AmexSymbol from "../../assets/checkout_logos/amex_symbol.svg?react";

export interface NumberCardFieldGroupProps {
  cardNo: string;
  expiration: string;
  cvv: string;
  onCardNoChange: () => void;
  onExpirationChange: () => void;
  onCVVChange: () => void;
  cardNoRef: RefCallBack;
  expirationRef: RefCallBack;
  cvvRef: RefCallBack;
}

const cellStyles = tv({
  base: "relative border-2 border-brand-colour-5 focus-within:outline-brand-colour-4 focus-within:outline-2 focus-within:-outline-offset-1",
});

const logoStyles = tv({
  base: "h-9/10 w-auto border border-stone-200 rounded p-[1px]",
});

function NumberCardFieldGroup({ ...props }: NumberCardFieldGroupProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <FieldGroup
      {...props}
      className={"flex flex-col gap-2 border-0 items-start p-1"}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      isInvalid={false}
    >
      {createLabel({ label: "Card Details", isRequired: true, isFocused })}
      <table className="border-collapse w-full table-fixed" role="presentation">
        <tbody>
          <tr>
            <td className={cellStyles()} colSpan={2}>
              <TextField
                placeholder="1234 1234 1234 1234"
                borderless="forCardNo"
              />
              <span className="absolute flex flex-row items-center justify-evenly h-full w-1/3 max-w-[130px] right-0 top-0">
                <MasterCardSymbol id="mastercard" className={logoStyles()} />
                <VisaSymbol id="visa" className={logoStyles()} />
                <AmexSymbol id="amex" className={logoStyles()} />
              </span>
            </td>
          </tr>
          <tr>
            <td className={cellStyles()}>
              <TextField placeholder="MM/YY" borderless="default" />
            </td>
            <td className={cellStyles()}>
              <TextField placeholder="CVV" borderless="default" />
            </td>
          </tr>
        </tbody>
      </table>
      {/* <div className="w-full">
        <div className="bg-amber-200 border-2">
          <TextField borderless />
        </div>
        <div className="flex relative">
          <p className="w-full invisible">
            <TextField borderless />
          </p>
          <div className="bg-cyan-200 border-2 absolute w-[calc(50%+2px)] -top-1 left-0">
            <TextField borderless />
          </div>
          <div className="bg-rose-200 border-2 absolute w-[calc(50%+2px)] -top-1 right-0">
            <TextField borderless />
          </div>
        </div>
      </div> */}
    </FieldGroup>
  );
}

export default NumberCardFieldGroup;
