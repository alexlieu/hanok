import { BasketResponseItem } from "../../types/BasketTypes";
import { formatPrice } from "../../utils/format";

interface OrderSummaryProps {
  items: BasketResponseItem[];
  total?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  return (
    <>
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
        {total && (
          <p className="flex justify-end items-center text-lg">
            Total: {formatPrice(total)}
          </p>
        )}
      </div>
    </>
  );
};

export default OrderSummary;
