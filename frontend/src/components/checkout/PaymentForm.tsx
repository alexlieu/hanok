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
import { LayoutGroup, motion, Variants } from "motion/react";
import { getIssuingBank } from "../../schemas/CardSchema";
import { allLogos, getActiveCards } from "../../utils/cardUtils";
import { tv } from "tailwind-variants";

const disclosureGroupVariants = tv({
  base: "border-x-2 border-x-brand-colour-5 border-y-2 border-y-transparent transition-[border-radius] transition-colors -my-[0.2rem] data-[expanded=false]:hover:bg-brand-colour-1/10 data-[expanded=false]:hover:border-brand-colour-1",
  variants: {
    isExpanded: { true: "border-2 border-brand-colour-5 my-5" },
    isAboveExpanded: {
      true: "border-b-2 border-t-2 border-b-brand-colour-5 border-t-transparent",
    },
    isBelowExpanded: {
      true: "border-t-2 border-b-2 border-t-brand-colour-5 border-b-transparent",
    },
    isTop: {
      true: "border-t-2 border-b-2 border-t-brand-colour-5 border-b-transparent",
    },
    isBottom: {
      true: "border-b-2 border-t-2 border-b-brand-colour-5 border-t-transparent",
    },
  },
  compoundVariants: [
    {
      isTop: true,
      isAboveExpanded: true,
      className: "border-2 border-t-brand-colour-5 border-b-brand-colour-5",
    },
    {
      isBottom: true,
      isBelowExpanded: true,
      className: "border-2 border-t-brand-colour-5 border-b-brand-colour-5",
    },
    {
      isTop: true,
      isExpanded: true,
      className:
        "border-2 border-t-brand-colour-5 border-b-brand-colour-5 mt-0",
    },
    {
      isBottom: true,
      isExpanded: true,
      className:
        "border-2 border-t-brand-colour-5 border-b-brand-colour-5 mb-0",
    },
  ],
});

const getBorderRadius = ({
  isExpanded,
  isAboveExpanded,
  isBelowExpanded,
  isTop,
  isBottom,
}: {
  isExpanded: boolean;
  isAboveExpanded: boolean;
  isBelowExpanded: boolean;
  isTop: boolean;
  isBottom: boolean;
}) => {
  const roundedVal = "0.75rem"; // 0.75 rem is xl value
  const rounded = roundedVal;
  const rounded_t = `${roundedVal} ${roundedVal} 0 0`;
  const rounded_b = `0 0 ${roundedVal} ${roundedVal}`;
  if (isExpanded) {
    return rounded;
  }
  if ((isTop && isAboveExpanded) || (isBottom && isBelowExpanded)) {
    return rounded;
  }
  if (isTop || isBelowExpanded) {
    return rounded_t;
  }
  if (isBottom || isAboveExpanded) {
    return rounded_b;
  }
  return "0px";
};

const PaymentForm = () => {
  const { control, clearErrors } = useFormContext();
  const paymentMethod = useWatch({ name: "paymentMethod", control });
  const expandedIndex = PAYMENT_METHODS.findIndex(
    (m) => m.value === paymentMethod
  );
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
            className=""
            isRequired={true}
            aria-label="Payment Method"
            inputRef={ref}
          >
            <LayoutGroup>
              {PAYMENT_METHODS.map(({ value, label }, index) => {
                const isExpanded = expandedIndex === index;
                const isAboveExpanded =
                  expandedIndex !== -1 && index === expandedIndex - 1;
                const isBelowExpanded =
                  expandedIndex !== -1 && index === expandedIndex + 1;
                const isTop = index === 0;
                const isBottom = index === PAYMENT_METHODS.length - 1;
                const borderRadius = getBorderRadius({
                  isExpanded,
                  isAboveExpanded,
                  isBelowExpanded,
                  isTop,
                  isBottom,
                });
                return (
                  <motion.div
                    data-expanded={isExpanded}
                    layout
                    className={disclosureGroupVariants({
                      isExpanded,
                      isAboveExpanded,
                      isBelowExpanded,
                      isTop,
                      isBottom,
                    })}
                    style={{ borderRadius }}
                    transition={{
                      layout: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      },
                    }}
                  >
                    <DisclosureRadio
                      className={`${
                        isExpanded
                          ? "border-b-2 border-b-brand-colour-5"
                          : "text-brand-colour-5"
                      } py-2 px-3 rounded-t-xl`}
                      value={value}
                      key={value}
                      panelContent={
                        value === "card" ? (
                          <div className="space-y-6 px-5 py-7">
                            {/* rounded-sm shadow-sm border border-gray-200 */}
                            <CardDetailsForm
                              issuingBank={issuingBank}
                              activeCards={activeCards}
                            />
                            <BillingAddressForm />
                          </div>
                        ) : (
                          <div className="px-5 py-7">
                            You're pure, you're kind, mature, divine. <br /> You
                            might be too good for me, unattainble.
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
                  </motion.div>
                );
              })}
            </LayoutGroup>
          </DisclosureRadioGroup>
        )}
      />
    </fieldset>
  );
};

export default PaymentForm;
