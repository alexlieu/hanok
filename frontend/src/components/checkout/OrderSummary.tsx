import { BasketResponseItem } from "../../types/BasketTypes";
import { formatPrice } from "../../utils/format";

interface OrderSummaryProps {
  items: BasketResponseItem[];
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  return (
    <>
      <div className="w-full bg-cyan-500">
        <ul>
          {items.map((item) => (
            <li
              className="flex flex-col"
              key={`${item.productName}-${item.flavour}-${item.size}`}
            >
              <span>{item.productName}</span>
              <span className="capitalize">
                {item.flavour.toLowerCase()}/{item.size.toLowerCase()}
              </span>
              <span>
                {item.quantity} x {formatPrice(item.unitPrice)} //{" "}
                {formatPrice(item.subTotal)}
              </span>
            </li>
          ))}
        </ul>
        <p>Total: {formatPrice(total)}</p>
      </div>
    </>
  );
};

export default OrderSummary;
