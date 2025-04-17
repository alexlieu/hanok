import { Link } from "react-router-dom";
import { useState } from "react";
import { useBasket } from "../utils/hooks/store/useBasket";
import BasketLineItem from "../components/basket/BasketLineItem";
import { formatPrice } from "../utils/format";
import { motion, AnimatePresence } from "motion/react";

const BasketPage: React.FC = () => {
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const { state, dispatch } = useBasket();

  const handleRemove = (id: number) => {
    const isLastItem = state.items.length === 1;
    setIsAnimatingOut(true);
    setRemovingId(id);
    setTimeout(
      () => {
        dispatch({
          type: "REMOVE_ITEM",
          id: id,
        });
        setRemovingId(null);
        setIsAnimatingOut(false);
      },
      isLastItem ? 2000 : 1000
    );
  };

  return (
    <>
      {!isAnimatingOut && state.items.length === 0 ? (
        <h2 className="text-9xl text-center">{`Your basket is empty :(`}</h2>
      ) : (
        <>
          <div role="list" className={`space-y-4 grid place-content-center`}>
            {state.items.map((item) => (
              <BasketLineItem
                item={item}
                key={item.id}
                isRemoving={removingId === item.id}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
            {state.items.length !== 0 && (
              <div className="flex justify-end">
                <motion.div
                  key="basket-footer"
                  layout={"position"}
                  transition={{
                    delay: isAnimatingOut ? 1 : 10,
                  }}
                  className="grid p-4 gap-3"
                >
                  <div className="justify-items-end">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-xl">{`${formatPrice(state.total)}`}</p>
                  </div>
                  <Link
                    to=""
                    className={`w-fit text-2xl font-medium px-4 py-2 border-black border-1 transition-colors hover:text-white hover:bg-black`}
                    aria-label={`Proceed to checkout, total ${formatPrice(
                      state.total
                    )}`}
                  >
                    Checkout
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </>
      )}
      <motion.div
        key="continue-shopping-link"
        layout={"position"}
        transition={{
          delay: isAnimatingOut ? 1 : 0,
        }}
        className="flex place-content-center pt-10"
      >
        <Link to={`/products`}>Continue shopping</Link>
      </motion.div>
    </>
  );
};
export default BasketPage;
