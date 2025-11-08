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
import { motion, Transition, Variants } from "motion/react";
import { getIssuingBank } from "../../schemas/CardSchema";
import { allLogos, getActiveCards } from "../../utils/cardUtils";
import { tv } from "tailwind-variants";
import TokenPaymentIcon from "../ui/icons/TokenPaymentIcon";
import { useWindowDimensions } from "../../utils/hooks/useWindowDimensions";

const borderRadiusTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 1.7,
};
const layoutTransition: Transition = {
  y: {
    type: "spring",
    stiffness: 300,
    damping: 10,
    mass: 0.9,
  },
  borderTopLeftRadius: borderRadiusTransition,
  borderTopRightRadius: borderRadiusTransition,
  borderBottomRightRadius: borderRadiusTransition,
  borderBottomLeftRadius: borderRadiusTransition,
};

const panelTransition: Transition = {
  ease: "easeOut",
  duration: 0.3,
};

const BORDER_WIDTH = 2;

const getAnimationStyles = ({
  index,
  expandedIndex,
}: {
  index: number;
  expandedIndex: number;
}) => {
  const GAP = 13;
  const isExpanded = index === expandedIndex;
  const isBefore = index < expandedIndex;
  const isAfter = index > expandedIndex;
  const isFirstAbove = expandedIndex !== -1 && index === expandedIndex - 1;
  const isFirstBelow = expandedIndex !== -1 && index === expandedIndex + 1;
  const isTop = index === 0;
  const isBottom = index === PAYMENT_METHODS.length - 1;

  const roundedVal = "0.5rem";
  const defaultBackgroundColor = "#e8e8e8";

  let borderTopLeftRadius = "0px";
  let borderTopRightRadius = "0px";
  let borderBottomRightRadius = "0px";
  let borderBottomLeftRadius = "0px";

  if (isExpanded) {
    borderTopLeftRadius = roundedVal;
    borderTopRightRadius = roundedVal;
    borderBottomRightRadius = roundedVal;
    borderBottomLeftRadius = roundedVal;
  } else if ((isTop && isFirstAbove) || (isBottom && isFirstBelow)) {
    borderTopLeftRadius = roundedVal;
    borderTopRightRadius = roundedVal;
    borderBottomRightRadius = roundedVal;
    borderBottomLeftRadius = roundedVal;
  } else if (isTop || isFirstBelow) {
    borderTopLeftRadius = roundedVal;
    borderTopRightRadius = roundedVal;
  } else if (isBottom || isFirstAbove) {
    borderBottomRightRadius = roundedVal;
    borderBottomLeftRadius = roundedVal;
  }

  const y = index * -BORDER_WIDTH;

  return {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    backgroundColor: defaultBackgroundColor,
    y: isBefore
      ? y
      : isExpanded
      ? isTop
        ? 0
        : y + GAP
      : isAfter
      ? expandedIndex === 0
        ? y + GAP
        : y + GAP * 2
      : 0,
  };
};

const PaymentForm = () => {
  const { width: windowWidth } = useWindowDimensions();
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
            isRequired={true}
            aria-label="Payment Method"
            inputRef={ref}
          >
            {PAYMENT_METHODS.map(({ value, label }, index) => {
              const isExpanded = expandedIndex === index;
              const borderStyle = getAnimationStyles({
                index,
                expandedIndex,
              });
              return (
                <motion.div
                  key={value}
                  initial={false}
                  layout="position"
                  layoutDependency={expandedIndex}
                  animate={borderStyle}
                  transition={layoutTransition}
                >
                  <DisclosureRadio
                    value={value}
                    panelTransition={panelTransition}
                    disableScrollTo={false}
                    scrollOffset="4.5rem" // Sticky header height: 4.5rem = 72px
                    panelContent={
                      value === "card" ? (
                        <div className="px-5 pt-3 pb-7 space-y-6">
                          <CardDetailsForm
                            issuingBank={issuingBank}
                            activeCards={activeCards}
                          />
                          <BillingAddressForm />
                        </div>
                      ) : (
                        <div className="py-3">
                          <TokenPaymentIcon
                            className={`m-auto ${
                              windowWidth < 1023 && windowWidth > 767
                                ? "-scale-x-100 w-1/2"
                                : "w-1/3"
                            }`}
                          />
                          <p className="text-center mt-4">
                            Click "Pay with {value}" to complete your purchase.
                          </p>
                        </div>
                      )
                    }
                  >
                    <DisclosureRadioHeader
                      className={`py-2 px-3 rounded-t-[0.5rem] ${
                        isExpanded
                          ? "bg-[#dbdbdb] border-b-2 border-b-brand-colour-5/30"
                          : "text-brand-colour-5"
                      }`}
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
          </DisclosureRadioGroup>
        )}
      />
    </fieldset>
  );
};

export default PaymentForm;
