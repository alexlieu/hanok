import { useLocation, useNavigate } from "react-router-dom";
import { OrderResponse } from "../types/order.types";
import { ReactNode, useEffect } from "react";
import { formatPrice } from "../utils/format";
import { tv } from "tailwind-variants";
import PickupMap from "../components/checkout/PickupMap";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";
import { Button } from "../components/ui/aria/Button";
import {
  LuCalendarPlus,
  LuMapPin,
  LuClock,
  LuNavigation,
  LuThermometerSnowflake,
  LuAlarmClock,
  LuWheatOff,
  LuDoorOpen,
} from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const careItemStyles = tv({
  base: "flex items-start gap-3 text-sm text-unavailable-text",
});

/** Reusable card for collection details (When, Where, Opening Times) */
interface CollectionDetailCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

const CollectionDetailCard = ({
  icon,
  title,
  children,
  className,
}: CollectionDetailCardProps) => (
  <div className={`flex gap-2 ${className ?? ""}`}>
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-colour-5/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-xs uppercase tracking-wide text-unavailable-text mb-0.5">
        {title}
      </h3>
      {children}
    </div>
  </div>
);

interface LocationState {
  orderData: OrderResponse;
}

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  useEffect(() => {
    if (!state || !state.orderData) {
      navigate("/");
    }
  }, [state, navigate]);
  if (!state || !state.orderData) {
    return null;
  }

  const { orderData } = state;

  // `orderData.pickupDateTime` is normally a `CalendarDate`, but when coming
  // from browser history (e.g. after refresh / back-forward navigation),
  // it may be a plain serialized value without the `.toDate` method.
  const rawPickup = orderData.pickupDateTime as unknown;

  let pickupDateTime: CalendarDate | null = null;

  if (typeof rawPickup === "string") {
    // ISO date string – parse to CalendarDate.
    pickupDateTime = parseDate(rawPickup);
  } else if (
    rawPickup &&
    typeof rawPickup === "object" &&
    typeof (rawPickup as CalendarDate).toDate === "function"
  ) {
    // Already a proper CalendarDate instance.
    pickupDateTime = rawPickup as CalendarDate;
  } else if (
    rawPickup &&
    typeof rawPickup === "object" &&
    "year" in rawPickup &&
    "month" in rawPickup &&
    "day" in rawPickup
  ) {
    // When coming from history state, CalendarDate may be de-serialized into a plain object.
    // Reconstruct a proper instance from its components.
    const { year, month, day } = rawPickup as {
      year: number;
      month: number;
      day: number;
    };
    pickupDateTime = new CalendarDate(year, month, day);
  }

  const formattedPickupDate = pickupDateTime
    ? dateFormatter.format(pickupDateTime.toDate(getLocalTimeZone()))
    : "";

  // Google Maps directions URL
  const storeAddress = "203 Kingston Rd, New Malden KT3 3SS";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    storeAddress,
  )}`;

  // Generate calendar event URL (Google Calendar)
  const generateCalendarUrl = () => {
    if (!pickupDateTime) return "#";
    const date = pickupDateTime.toString().replace(/-/g, "");
    const title = encodeURIComponent(
      `Hanok Cafe Pickup - Order #${orderData.orderNumber}`,
    );
    const location = encodeURIComponent(storeAddress);
    const details = encodeURIComponent(
      `Pickup your order from Hanok Cafe.\n\nTime slot: ${orderData.pickupSlot}\nOrder #${orderData.orderNumber}`,
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${date}&details=${details}&location=${location}`;
  };

  const isTokenPayment =
    orderData.paymentMethod === "APPLE" ||
    orderData.paymentMethod === "GOOGLE" ||
    orderData.paymentMethod === "PAYPAL";

  const paymentMethodMessage =
    orderData.paymentMethod === "CARD" && orderData.maskedCardNo
      ? "Paid via card ending " +
        [...orderData.maskedCardNo.matchAll(/[0-9]/g)].join("")
      : isTokenPayment
        ? "Paid via " +
          orderData.paymentMethod.charAt(0).toUpperCase() +
          orderData.paymentMethod.substring(1).toLowerCase()
        : "";

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 m-auto max-w-[80rem]">
      {/* 70:30 Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 lg:gap-10">
        {/* Left Column - Logistics (70%) */}
        <div className="space-y-5">
          {/* Header / Thank You Section */}
          <header>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide mb-2">
              Thank you!
            </h1>
            <div className="md:pl-1">
              <p className="text-lg sm:text-xl text-unavailable-text">
                Order #{orderData.orderNumber}
              </p>
              <p className="text-sm sm:text-base mt-3 max-w-lg">
                We'll send a confirmation email to{" "}
                <span className="font-medium">{orderData.email}</span> with your
                order details and updates.
              </p>
            </div>
          </header>

          {/* Collection Details + Map */}
          <section>
            <h2 className="text-xl sm:text-2xl font-medium mb-3 lowercase">
              collection details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Left: Map */}
              <div className="order-2 md:order-1">
                <PickupMap />
              </div>
              {/* Right: When, Where & Opening Times */}
              {/* Layout: 1-col → 2-col at 480px (When|Opening Times, Where below) → 1-col at md */}
              <div className="order-1 md:order-2 grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-1 md:max-h-80 gap-5 md:gap-0 md:content-between md:py-1">
                {/* When */}
                <CollectionDetailCard
                  icon={
                    <LuClock className="w-[60%] h-[60%] text-brand-colour-5" />
                  }
                  title="When"
                  className="order-1"
                >
                  <p className="text-sm sm:text-base font-medium">
                    {formattedPickupDate}
                  </p>
                  <p className="text-xs sm:text-sm text-unavailable-text lowercase">
                    {orderData.pickupSlot}
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-2 text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
                    onPress={() => window.open(generateCalendarUrl(), "_blank")}
                  >
                    <LuCalendarPlus className="w-3.5 h-3.5" />
                    Add to Calendar
                  </Button>
                </CollectionDetailCard>

                {/* Where */}
                <CollectionDetailCard
                  icon={
                    <LuMapPin className="w-[60%] h-[60%] text-brand-colour-5" />
                  }
                  title="Where"
                  className="order-2 min-[480px]:order-last md:order-2 md:col-span-1"
                >
                  <p className="text-sm sm:text-base font-medium">
                    {storeAddress}
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-2 text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
                    onPress={() => window.open(directionsUrl, "_blank")}
                  >
                    <LuNavigation className="w-3.5 h-3.5" />
                    Get Directions
                  </Button>
                </CollectionDetailCard>

                {/* Opening Times */}
                <CollectionDetailCard
                  icon={
                    <LuDoorOpen className="w-[60%] h-[60%] text-brand-colour-5" />
                  }
                  title="Opening Times"
                  className="order-3 min-[480px]:order-2 md:order-3"
                >
                  <div className="text-sm sm:text-base space-y-0.5">
                    {[
                      { days: "Mon–Fri", hours: "9am – 7pm" },
                      { days: "Sat", hours: "10am – 7pm" },
                      { days: "Sun", hours: "10am – 6pm" },
                    ].map(({ days, hours }) => (
                      <div key={days} className="flex gap-1 sm:gap-3">
                        <span className="text-unavailable-text w-15 flex-shrink-0 whitespace-nowrap">
                          {days}
                        </span>
                        <span className="font-medium whitespace-nowrap">
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CollectionDetailCard>
              </div>
            </div>
          </section>

          {/* Need Help */}
          <section>
            <h2 className="text-xl sm:text-2xl font-medium mb-3 lowercase">
              need help?
            </h2>
            <p className="text-sm sm:text-base text-unavailable-text mb-4">
              DM us and we'll get back to you during business hours.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/hanok.cafe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-brand-colour-5/10 flex items-center justify-center hover:bg-brand-colour-5/20 transition-colors"
                aria-label="Contact us on Instagram"
              >
                <FaInstagram className="w-5 h-5 text-brand-colour-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-brand-colour-5/10 flex items-center justify-center hover:bg-brand-colour-5/20 transition-colors"
                aria-label="Contact us on KakaoTalk"
              >
                <RiKakaoTalkFill className="w-5 h-5 text-brand-colour-5" />
              </a>
            </div>
          </section>
        </div>

        {/* Right Column - Receipt Card (30%) */}
        <div className="lg:pt-0">
          <div className="bg-[#EAEAEA] rounded-sm p-5 sm:p-6 space-y-5 lg:sticky lg:top-6">
            {/* Order Summary */}
            <div>
              <h2 className="text-lg font-medium mb-4 lowercase">
                order summary
              </h2>
              <div className="space-y-3">
                {orderData.orderItems.map((item) => (
                  <div
                    key={
                      item.productName +
                      item.variantConfig.flavour +
                      item.variantConfig.size
                    }
                    className="flex justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-unavailable-text">
                        {" "}
                        x{item.quantity}
                      </span>
                      <p className="text-xs text-unavailable-text capitalize truncate">
                        {item.variantConfig.flavour.toLowerCase()}/
                        {item.variantConfig.size.toLowerCase()}
                      </p>
                    </div>
                    <span className="flex-shrink-0 tabular-nums">
                      {formatPrice(parseFloat(item.itemTotal))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center font-medium">
                <span className="lowercase">total paid</span>
                <span className="tabular-nums">
                  {formatPrice(parseFloat(orderData.total))}
                </span>
              </div>
              <p className="text-xs text-unavailable-text mt-1">
                {paymentMethodMessage}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Care Information */}
            <div>
              <h3 className="text-sm font-medium mb-3 lowercase">
                important care info
              </h3>
              <div className="space-y-3">
                <div className={careItemStyles()}>
                  <LuThermometerSnowflake className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-colour-5" />
                  <span>Refrigerate on arrival (4°C or below)</span>
                </div>
                <div className={careItemStyles()}>
                  <LuAlarmClock className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-colour-5" />
                  <span>Best consumed within 3 days</span>
                </div>
                <div className={careItemStyles()}>
                  <LuWheatOff className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-colour-5" />
                  <span>May contain common allergens</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
