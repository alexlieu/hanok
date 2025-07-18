import { BasketResponseItem } from "../../types/BasketTypes";
import { formatPrice } from "../../utils/format";

interface OrderSummaryProps {
  items: BasketResponseItem[];
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  return (
    <>
      <div className="w-full">
        <ul className="">
          {items.map((item) => (
            <li
              className="grid grid-cols-[auto_1fr_auto] gap-x-4 items-center border-y-2 mt-[-2px] py-2"
              key={`${item.productName}-${item.flavour}-${item.size}`}
            >
              <div className="size-16 flex items-center justify-center overflow-hidden">
                <img
                  src={""}
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
        <p className="flex justify-end items-center text-lg">
          Total: {formatPrice(total)}
        </p>
      </div>
    </>
  );
};

export default OrderSummary;
