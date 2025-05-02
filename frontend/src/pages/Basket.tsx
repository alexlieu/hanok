import { Link } from "react-router-dom";
import { useBasketState } from "../utils/hooks/store/useBasket";
import BasketLineItem from "../components/basket/BasketLineItem";
import BasketFooter from "../components/basket/BasketFooter";
import { motion, LayoutGroup, AnimatePresence } from "motion/react";
import { easeInOutExpo } from "../utils/ease";
import { useEffect, useRef, useState } from "react";

const BasketPage: React.FC = () => {
  const state = useBasketState();

  const [isEmptyThroughDeletion, setIsEmptyThroughDeletion] = useState(false);
  const previousItemCount = useRef(state.items.length);

  useEffect(() => {
    if (state.items.length === 0 && previousItemCount.current > 0) {
      setIsEmptyThroughDeletion(true);
    }
    if (state.items.length > 0) {
      setIsEmptyThroughDeletion(false);
    }
  }, [state.items.length]);

  return (
    <LayoutGroup>
      <motion.div layout initial={false} className="min-h-[500px] w-full">
        <AnimatePresence mode="wait">
          {state.items.length === 0 ? (
            <motion.h2
              key="empty-state"
              layout="position"
              className="text-center text-[clamp(4rem,9vw,6rem)] pt-[15vb] font-outfit"
              initial={isEmptyThroughDeletion ? { opacity: 0 } : false}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: easeInOutExpo,
                  delay: 0.2,
                },
              }}
            >
              {`Your basket is empty`}
              <span className="pl-[0.2em] text-nowrap">{`:(`}</span>
            </motion.h2>
          ) : (
            <motion.div
              key="basket-content"
              className="space-y-4 mx-auto w-[clamp(40ch,70%,70ch)]"
              layout="position"
              exit={{ opacity: 0 }}
            >
              <AnimatePresence mode="sync">
                {state.items.map((item) => (
                  <BasketLineItem item={item} key={item.id} />
                ))}
              </AnimatePresence>
              <BasketFooter />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          layout="position"
          transition={{
            delay: state.items.length === 0 ? 0.1 : 0,
            ease: easeInOutExpo,
            duration: 0.6,
          }}
          className={`flex place-content-center pt-10 ${
            state.items.length > 0 ? "mt-3" : "pt-5 mt-0"
          }`}
        >
          <Link to="/products">Continue shopping</Link>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
};
export default BasketPage;
