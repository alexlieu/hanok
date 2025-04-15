import { BasketItem } from "../../types/BasketTypes";
import { getRandomBGColour } from "../../utils/fun";
import { useBasketDispatch } from "../../utils/hooks/store/useBasket";
import QuantityControls from "./QuantityControls";
import RemoveButton from "./RemoveButton";
import { useMemo } from "react";
import { formatPrice } from "../../utils/format";
import { Link } from "react-router-dom";

type BasketLineItemProps = {
  item: BasketItem;
};
const BasketLineItem: React.FC<BasketLineItemProps> = ({ item }) => {
  const dispatch = useBasketDispatch();

  const bgColor = useMemo(() => getRandomBGColour(), []);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      id: itemId,
      quantity: newQuantity,
    });
  };

  return (
    <div
      role="listitem"
      className={`grid grid-cols-12 gap-4 p-4 border-b w-4xl`}
    >
      <img
        src="empty"
        className={`col-span-2 w-full aspect-square object-cover ${bgColor}`}
        alt="empty"
      />
      <div className={`col-span-6 grid`}>
        <div>
          <Link to={item.url}>
            <h3 className="font-medium">{item.name}</h3>
          </Link>
          <p
            className={`text-gray-600 capitalize`}
          >{`${item.flavour.toLowerCase()} / ${item.size.toLowerCase()}`}</p>
        </div>
        <div className={`flex item-center gap-4 mt-2`}>
          <QuantityControls
            quantity={item.quantity}
            onQuantityChange={(newQty) => handleQuantityChange(item.id, newQty)}
            onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
            onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)}
          />
          <RemoveButton itemId={item.id} />
        </div>
      </div>
      <div className={`col-span-2`}></div>
      <div className={`col-span-2 justify-items-end`}>
        <p className="">{formatPrice(item.quantity * item.price)}</p>
      </div>
    </div>
  );
};

export default BasketLineItem;
