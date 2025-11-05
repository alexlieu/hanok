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
import { LayoutGroup, motion, Transition, Variants } from "motion/react";
import { getIssuingBank } from "../../schemas/CardSchema";
import { allLogos, getActiveCards } from "../../utils/cardUtils";
import { tv } from "tailwind-variants";
import TokenPaymentIcon from "../ui/icons/TokenPaymentIcon";
import { useWindowDimensions } from "../../utils/hooks/useWindowDimensions";

const panelTransition: Transition = {
  default: {
    type: "spring",
    stiffness: 400,
    damping: 25,
    mass: 1.7,
    delay: 0.05,
  },
};

// Helper function to get animated border styles (similar to Tailwind Variants)
const getAnimatedBorderStyle = ({
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
  const roundedVal = "0.5rem";
  const defaultBackgroundColor = "#e8e8e8";

  if (isExpanded) {
    return {
      borderTopLeftRadius: roundedVal,
      borderTopRightRadius: roundedVal,
      borderBottomRightRadius: roundedVal,
      borderBottomLeftRadius: roundedVal,
      backgroundColor: defaultBackgroundColor,
      x: 5,
    };
  }

  let borderTopLeft = "0px";
  let borderTopRight = "0px";
  let borderBottomRight = "0px";
  let borderBottomLeft = "0px";

  if ((isTop && isAboveExpanded) || (isBottom && isBelowExpanded)) {
    borderTopLeft = roundedVal;
    borderTopRight = roundedVal;
    borderBottomRight = roundedVal;
    borderBottomLeft = roundedVal;
  } else if (isTop || isBelowExpanded) {
    borderTopLeft = roundedVal;
    borderTopRight = roundedVal;
  } else if (isBottom || isAboveExpanded) {
    borderBottomRight = roundedVal;
    borderBottomLeft = roundedVal;
  }

  return {
    borderTopLeftRadius: borderTopLeft,
    borderTopRightRadius: borderTopRight,
    borderBottomRightRadius: borderBottomRight,
    borderBottomLeftRadius: borderBottomLeft,
    backgroundColor: defaultBackgroundColor,
    x: 0,
  };
};

const getMarginStyles = ({
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
  if (isExpanded) {
    return {
      marginTop: isTop ? 0 : 10,
      marginBottom: isBottom ? 0 : 10,
    };
  }
  const showTop = isTop || isBelowExpanded;
  const showBottom = isBottom || isAboveExpanded;
  const marginTop = showTop ? 0 : -2;
  const marginBottom = showBottom ? 0 : -2;
  return {
    marginTop,
    marginBottom,
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
          <LayoutGroup id="payment-methods-group">
            <DisclosureRadioGroup
              onChange={onChange}
              value={value}
              isRequired={true}
              aria-label="Payment Method"
              inputRef={ref}
            >
              {PAYMENT_METHODS.map(({ value, label }, index) => {
                const isExpanded = expandedIndex === index;
                const isAboveExpanded =
                  expandedIndex !== -1 && index === expandedIndex - 1;
                const isBelowExpanded =
                  expandedIndex !== -1 && index === expandedIndex + 1;
                const isTop = index === 0;
                const isBottom = index === PAYMENT_METHODS.length - 1;
                const borderStyle = getAnimatedBorderStyle({
                  isExpanded,
                  isAboveExpanded,
                  isBelowExpanded,
                  isTop,
                  isBottom,
                });
                const marginStyles = getMarginStyles({
                  isExpanded,
                  isAboveExpanded,
                  isBelowExpanded,
                  isTop,
                  isBottom,
                });
                return (
                  <motion.div
                    key={value}
                    initial={false}
                    layout="position"
                    layoutDependency={expandedIndex}
                    animate={borderStyle}
                    transition={panelTransition}
                    style={marginStyles}
                  >
                    <DisclosureRadio
                      className={`${
                        isExpanded ? "bg-[#dbdbdb]" : "text-brand-colour-5"
                      } py-2 px-3 rounded-t-[0.5rem]`}
                      value={value}
                      panelContent={
                        value === "card" ? (
                          <div className={`space-y-6 px-5 pt-3 pb-7`}>
                            {/* rounded-sm shadow-sm border border-gray-200 */}
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
                              Click "Pay with {value}" to complete your
                              purchase.
                            </p>
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
            </DisclosureRadioGroup>
          </LayoutGroup>
        )}
      />
    </fieldset>
  );
};

export default PaymentForm;
