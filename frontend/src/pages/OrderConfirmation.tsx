import { useLocation, useNavigate } from "react-router-dom";
import { OrderResponse } from "../types/order.types";
import { useEffect } from "react";
import { formatPrice } from "../utils/format";
import { tv } from "tailwind-variants";
import PickupMap from "../components/checkout/PickupMap";

const headerCellStyles = tv({
  base: "py-3 text-left text-sm font-medium lowercase tracking-wider text-gray-500",
  variants: {
    center: {
      true: "text-center",
    },
    right: {
      true: "text-right",
    },
  },
});

const cellStyles = tv({
  base: "text-left align-middle",
  variants: {
    productName: {
      true: "flex flex-row text-left items-center gap-2 align-top mt-[0.7rem]",
    },
    price: {
      true: "text-right",
    },
  },
});

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

  const offsetItemTotal = (itemTotal: string) => {
    const itemTotalWithoutSymbol = formatPrice(parseFloat(itemTotal)).slice(1);
    const offsetItemTotal = itemTotalWithoutSymbol.padStart(
      orderData.total.length + 3,
      "\u00A0"
    );
    console.log(offsetItemTotal);
    return offsetItemTotal;
  };

  return (
    <div className="mt-[1rem] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-6xl font-medium tracking-wide">Order Received!</h1>
        <p className="text-xl">
          Order Number: #
          <span className="font-medium">{orderData.orderNumber}</span>
        </p>
        <div className="w-3/4 text-center">
          <p>
            Thank you for your order! We're processing it now so you'll receive
            an order confirmation email shortly to{" "}
            <span className="font-medium">{orderData.email}</span>.
          </p>
          <p>We'll keep you updated on your order status via the same email.</p>
        </div>
      </div>

      <table className="border-collapse w-2/5">
        <thead className="border-b border-gray-300">
          <tr>
            <th className={headerCellStyles()}>Product</th>
            <th className={headerCellStyles({ right: true })}>Total</th>
          </tr>
        </thead>
        <tbody>
          {orderData.orderItems.map((item) => (
            <tr
              key={
                item.productName +
                item.variantConfig.flavour +
                item.variantConfig.size
              }
            >
              <td className={cellStyles({ productName: true })}>
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23d1fae5' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2310b981' font-size='12' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E"
                  alt={item.productName}
                  className="w-16 h-16 object-cover"
                />
                <span className="flex flex-row items-center gap-2">
                  <span className="inline-block">
                    {item.quantity}
                    {" x"}
                  </span>
                  <span className="inline-block">
                    {item.productName}
                    <span className="capitalize text-sm block">
                      {item.variantConfig.flavour.toLowerCase()}/
                      {item.variantConfig.size.toLowerCase()}
                    </span>
                  </span>
                </span>
              </td>
              <td className={cellStyles({ price: true })}>
                {offsetItemTotal(item.itemTotal)}
              </td>
            </tr>
          ))}
          <tr className="border-t border-gray-300">
            <td className="text-right align-middle py-3 pr-2 font-medium">
              Total:
            </td>
            <td className={cellStyles({ price: true })}>
              {formatPrice(parseFloat(orderData.total))}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="w-1/4">
        <h2>Collection Details</h2>
        <div className="w-full">
          <PickupMap />
        </div>
      </div>
      <div>
        <p>Order Status: {orderData.orderStatus}</p>
        <p>Payment Method: {orderData.paymentMethod}</p>
        <p>Masked Card No: {orderData.maskedCardNo}</p>
        <p>Pickup Slot: {orderData.pickupSlot}</p>
      </div>
      <p>
        Order Items:{" "}
        {orderData.orderItems.map((item) => item.productName).join(", ")}
      </p>
      <p>Total: {formatPrice(parseFloat(orderData.total))}</p>
    </div>
  );
};

export default OrderConfirmationPage;
