import { Navigate, useLoaderData } from "react-router-dom";
import { BasketResponse } from "../types/BasketTypes";
import OrderSummary from "../components/checkout/OrderSummary";
import PickupMap from "../components/checkout/PickupMap";
import CheckoutForm from "../components/checkout/CheckoutForm";
import { useMediaQuery } from "../utils/hooks/useWindowDimensions";
import { AccordianItem } from "../components/ui/AccordianItem";
import { useState } from "react";

const CheckoutPage: React.FC = () => {
  const { items, total }: BasketResponse = useLoaderData();
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  if (items.length <= 0 && total <= 0) {
    return <Navigate to="/basket" />;
  }

  const openOrderSummary = () => {
    setOrderSummaryExpanded((prevVal) => !prevVal);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-[70em] m-auto justify-center items-center md:items-start">
      <div className="w-full order-2 md:order-1 md:w-4/7 py-7 self-start">
        <CheckoutForm />
      </div>
      {isSmallScreen ? (
        <AccordianItem
          title="Order Summary"
          isExpanded={orderSummaryExpanded}
          onToggle={() => openOrderSummary()}
          containerStyle="w-full px-10 font-medium pt-7"
          buttonStyle="tracking-wide text-xl"
        >
          <div className="flex flex-col sm:flex-row sm:gap-3 md:flex-col">
            <PickupMap />
            <OrderSummary items={items} total={total} />
          </div>
        </AccordianItem>
      ) : (
        <div className="w-[85%] order-1 md:order-2 md:w-3/7 p-7 flex flex-col items-center min-w-[270px] md:sticky md:top-0">
          <PickupMap />
          <OrderSummary items={items} total={total} />
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
