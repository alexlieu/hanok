import CardDetailsForm from "./CardDetailsForm";
import BillingAddressForm from "./BillingAddressForm";
import { PAYMENT_METHODS } from "../../schemas/CustomerFormSchema";
import {
  DisclosureRadio,
  DisclosureRadioGroup,
  DisclosureRadioHeader,
} from "../ui/aria/DisclosureRadio";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import Visa from "../../assets/checkout_logos/visa.svg?react";
import Mastercard from "../../assets/checkout_logos/mastercard.svg?react";
import Amex from "../../assets/checkout_logos/amex.svg?react";
import Paypal from "../../assets/checkout_logos/payment-types/paypal-logo-alternative.svg?react";
import Apple from "../../assets/checkout_logos/payment-types/apple-pay-logo.svg?react";
import Google from "../../assets/checkout_logos/payment-types/google-pay-logo.svg?react";
import { motion, Variants } from "motion/react";
import { getIssuingBank } from "../../schemas/CardSchema";
import { allLogos, getActiveCards } from "../../utils/cardUtils";
import { tv } from "tailwind-variants";

const PaymentForm = () => {
  const { control, clearErrors } = useFormContext();
  const paymentMethod = useWatch({ name: "paymentMethod", control });
  const cardNumber = useWatch({ name: "cardNumber", control });
  const issuingBank = getIssuingBank(cardNumber);
  const activeCards =
    paymentMethod === "card" ? getActiveCards(issuingBank) : allLogos;

  // Clear validation errors for card and billing address fields when payment method is not "card"
  // BUT keep the field values
  useEffect(() => {
    if (paymentMethod !== "card") {
      clearErrors("cardNumber");
      clearErrors("expiration");
      clearErrors("cvv");
      clearErrors("holderName");

      clearErrors("country");
      clearErrors("addressLine1");
      clearErrors("addressLine2");
      clearErrors("city");
      clearErrors("stateProvinceRegion");
      clearErrors("county");
      clearErrors("postalCode");
    }
  }, [paymentMethod, clearErrors]);

  return (
    <fieldset className="">
      <legend className="lowercase tracking-wide text-lg font-medium mb-2">
        payment method
      </legend>
      <Controller
        name="paymentMethod"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <DisclosureRadioGroup
            onChange={onChange}
            value={value}
            className="space-y-2"
            isRequired={true}
            aria-label="Payment Method"
            inputRef={ref}
          >
            {PAYMENT_METHODS.map(({ value, label }) => (
              <DisclosureRadio
                className=""
                value={value}
                key={value}
                panelContent={
                  value === "card" && (
                    <div className="space-y-6 px-5 py-7 rounded-sm shadow-sm border border-gray-200">
                      <CardDetailsForm
                        issuingBank={issuingBank}
                        activeCards={activeCards}
                      />
                      <BillingAddressForm />
                    </div>
                  )
                }
              >
                <DisclosureRadioHeader
                  rightSlot={() => {
                    const logoStyles = tv({
                      base: "h-[1.25rem] w-auto",
                    });
                    const logoVariants: Variants = {
                      normal: {
                        filter: "grayscale(0%)",
                        y: 0,
                        opacity: 1,
                      },
                      grayedOut: {
                        filter: "grayscale(100%)",
                        y: 0.5,
                        opacity: 0.6,
                      },
                    };
                    if (value === "card") {
                      return (
                        <ul className="flex items-center gap-2">
                          {allLogos.map((logo) => (
                            <motion.li
                              key={logo}
                              variants={logoVariants}
                              initial="normal"
                              animate={
                                activeCards.includes(logo)
                                  ? "normal"
                                  : "grayedOut"
                              }
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
                      );
                    }
                    if (value === "apple") {
                      return <Apple className={logoStyles()} />;
                    }
                    if (value === "google") {
                      return <Google className={logoStyles()} />;
                    }
                    if (value === "paypal") {
                      return <Paypal className={logoStyles()} />;
                    }
                  }}
                >
                  {label}
                </DisclosureRadioHeader>
              </DisclosureRadio>
            ))}
          </DisclosureRadioGroup>
        )}
      />
    </fieldset>
  );
};

export default PaymentForm;
