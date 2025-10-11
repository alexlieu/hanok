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

  const EXIT_DURATION = 0.7;
  const EXIT_DELAY = EXIT_DURATION * 0.7;

  return (
    <motion.div
      layout
      layoutId={`basket-item-${item.variantId}`}
      initial={false}
      exit={{
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        transition: {
          duration: EXIT_DURATION,
          ease: easeInOutExpo,
          delay: EXIT_DELAY,
        },
      }}
      className="overflow-hidden"
    >
      <motion.div
        initial={false}
        exit={{
          y: "-104%",
          transition: {
            type: "spring",
            damping: 50,
            stiffness: 300,
            duration: EXIT_DURATION,
          },
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
                {item.productName}
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
                handleQuantityChange(item.variantId, newQty)
              }
              onIncrease={() =>
                handleQuantityChange(item.variantId, Number(item.quantity) + 1)
              }
              onDecrease={() =>
                handleQuantityChange(item.variantId, Number(item.quantity) - 1)
              }
            />
            <RemoveButton itemId={item.variantId} />
          </div>
        </div>
        <div className={`shrink-0 w-20 text-right`}>
          <p className="font-medium">
            {formatPrice(item.quantity * item.unitPrice)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BasketLineItem;
