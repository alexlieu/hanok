import { useLocation, useNavigate } from "react-router-dom";
import { OrderResponse } from "../types/order.types";
import { useEffect } from "react";
import { formatPrice } from "../utils/format";

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
  return (
    <div>
      <h1>Order Confirmation</h1>
      <p>Order Date: {orderData.orderDateTime.toAbsoluteString()}</p>
      <p>Order Status: {orderData.orderStatus}</p>
      <p>Payment Method: {orderData.paymentMethod}</p>
      <p>Masked Card No: {orderData.maskedCardNo}</p>
      <p>Pickup Slot: {orderData.pickupSlot}</p>
      <p>
        Order Items:{" "}
        {orderData.orderItems.map((item) => item.productName).join(", ")}
      </p>
      <p>Total: {formatPrice(parseFloat(orderData.total))}</p>
    </div>
  );
};

export default OrderConfirmationPage;
