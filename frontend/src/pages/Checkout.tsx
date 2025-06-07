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
    <>
      <OrderSummary items={items} total={total} />
      <PickupMap />
      <CheckoutForm />
    </>
  );
};

export default CheckoutPage;
