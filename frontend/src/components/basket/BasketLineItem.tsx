import { BasketItem } from "../../types/BasketTypes";
import { getRandomBGColour } from "../../utils/fun";
import { useBasketDispatch } from "../../utils/hooks/store/useBasket";
import QuantityControls from "./QuantityControls";
import RemoveButton from "./RemoveButton";
import { useMemo } from "react";
import { formatPrice } from "../../utils/format";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { easeInOutExpo } from "../../utils/ease";

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
    <motion.div layout className="overflow-hidden w-full">
      <motion.div
        layout
        initial={false}
        exit={{
          y: "-104%",
          transition: { duration: 0.8, ease: easeInOutExpo },
        }}
        role="listitem"
        className={`flex items-center gap-4 p-4 border-b border border-indigo-600`}
      >
        <div className="shrink-0 w-24 h-24">
          <img
            src="empty"
            className={`w-full h-full object-cover ${bgColor}`}
            alt="empty"
          />
        </div>
        <div
          className={`flex-1 flex flex-col sm:flex-row justify-between min-w-0 border border-lime-500 h-[96px]`}
        >
          <div className="min-w-0 h-fit border border-amber-300">
            <Link to={item.url}>
              <h3 className="font-medium hover:text-blue-500 transition-colors truncate">
                {item.name}
              </h3>
            </Link>
            <p
              className={`text-gray-600 capitalize truncate`}
            >{`${item.flavour.toLowerCase()} / ${item.size.toLowerCase()}`}</p>
          </div>
          <div
            className={`shrink-0 flex flex-row sm:flex-col gap-x-4 border border-cyan-300 place-content-center`}
          >
            <QuantityControls
              quantity={item.quantity}
              onQuantityChange={(newQty) =>
                handleQuantityChange(item.id, newQty)
              }
              onIncrease={() =>
                handleQuantityChange(item.id, Number(item.quantity) + 1)
              }
              onDecrease={() =>
                handleQuantityChange(item.id, Number(item.quantity) - 1)
              }
            />
            <RemoveButton itemId={item.id} />
          </div>
        </div>
        <div className={`shrink-0 w-20 text-right`}>
          <p className="font-medium">
            {formatPrice(item.quantity * item.price)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BasketLineItem;
