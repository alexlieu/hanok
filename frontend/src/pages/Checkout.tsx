import { Navigate, useLoaderData } from "react-router-dom";
import { BasketResponse } from "../types/BasketTypes";
import OrderSummary from "../components/checkout/OrderSummary";
import PickupMap from "../components/checkout/PickupMap";
import CheckoutForm from "../components/checkout/CheckoutForm";

const CheckoutPage: React.FC = () => {
  const { items, total }: BasketResponse = useLoaderData();
  if (items.length <= 0 && total <= 0) {
    return <Navigate to="/basket" />;
  }
  return (
    <div className="flex flex-col md:flex-row max-w-[70em] m-auto justify-center items-center md:items-start">
      <div className="w-full order-2 md:order-1 md:w-4/7 py-7 self-start">
        <CheckoutForm />
      </div>
      <div className="w-[85%] order-1 md:order-2 md:w-3/7 p-7 flex flex-col items-center min-w-[270px] md:sticky md:top-0">
        <PickupMap />
        <OrderSummary items={items} total={total} />
      </div>
    </div>
  );
};

export default CheckoutPage;
