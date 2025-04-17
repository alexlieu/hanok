import { BasketItem } from "../../types/BasketTypes";
import { getStableBGColor } from "../../utils/fun";
import { useBasketDispatch } from "../../utils/hooks/store/useBasket";
import QuantityControls from "./QuantityControls";
import RemoveButton from "./RemoveButton";
import { formatPrice } from "../../utils/format";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

type BasketLineItemProps = {
  item: BasketItem;
  isRemoving?: boolean;
  onRemove: () => void;
};

const BasketLineItem: React.FC<BasketLineItemProps> = ({
  item,
  isRemoving,
  onRemove,
}) => {
  const dispatch = useBasketDispatch();

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      id: itemId,
      quantity: newQuantity,
    });
  };

  return (
    <AnimatePresence mode="popLayout">
      {!isRemoving && (
        <motion.div
          key="hidden"
          layout
          transition={{ delay: 1 }}
          className="overflow-hidden"
        >
          <motion.div
            key="basket-line-item"
            initial={false}
            exit={{
              y: "-104%",
              transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2,
              },
            }}
            role="listitem"
            className={`grid grid-cols-12 gap-4 p-4 border-b w-4xl`}
          >
            <img
              src="empty"
              className={`col-span-2 w-full aspect-square object-cover ${getStableBGColor(
                item.id
              )}`}
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
                  onQuantityChange={(newQty) =>
                    handleQuantityChange(item.id, newQty)
                  }
                  onIncrease={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  onDecrease={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                />
                <RemoveButton onRemove={onRemove} />
              </div>
            </div>
            <div className={`col-span-2`}></div>
            <div className={`col-span-2 justify-items-end`}>
              <p className="">{formatPrice(item.quantity * item.price)}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BasketLineItem;
