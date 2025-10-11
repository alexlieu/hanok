import { useFormContext, useWatch } from "react-hook-form";
import { BasketResponseItem } from "../../types/BasketTypes";
import { formatPrice } from "../../utils/format";
import { Button } from "../ui/aria/Button";
import { AnimatePresence, motion } from "motion/react";

interface OrderSummaryProps {
  items: BasketResponseItem[];
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  const paymentMethod = useWatch({
    control: useFormContext().control,
    name: "paymentMethod",
  });

  return (
    <>
      <h2 className="lowercase text-[1.5rem] mb-4">order summary</h2>
      <div className="w-full">
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              className="grid grid-cols-[auto_1fr_auto] gap-x-4 shadow-sm items-center mt-[-2px] py-2 px-2"
              key={`${item.productName}-${item.flavour}-${item.size}`}
            >
              <div className="size-16 flex items-center justify-center overflow-hidden">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23d1fae5' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2310b981' font-size='12' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E"
                  alt={item.productName}
                  className="size-full object-cover bg-emerald-200"
                />
              </div>
              {/* Product details */}
              <div className="flex flex-col">
                <span className="tracking-wide">{item.productName}</span>
                <span className="capitalize font-light text-sm">
                  {item.flavour.toLowerCase()}/{item.size.toLowerCase()}
                </span>
              </div>
              {/* Quantity and price */}
              <div className="text-right whitespace-nowrap">
                <span className="block text-sm">
                  {item.quantity} x {formatPrice(item.unitPrice)}
                </span>
                <span className="font-semibold">
                  {formatPrice(item.subTotal)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-lg font-semibold px-2">
          <span>total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <Button
        type="submit"
        form="checkout-form"
        variant="secondary"
        className="w-full"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={paymentMethod}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          >
            {paymentMethod !== "card"
              ? `Pay with ${paymentMethod}`
              : "Place Order"}
          </motion.span>
        </AnimatePresence>
      </Button>
    </>
  );
};

export default OrderSummary;
