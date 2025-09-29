import { Link } from "react-router-dom";
import { useBasketState } from "../utils/hooks/store/useBasket";
import BasketLineItem from "../components/basket/BasketLineItem";
import BasketFooter from "../components/basket/BasketFooter";
import { motion, LayoutGroup, AnimatePresence } from "motion/react";
import { easeInOutExpo } from "../utils/ease";
import { useEffect, useRef, useState } from "react";
import { VerticalCutAnimatedText } from "../animations/VerticalCutAnimatedText";

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

  const createContinueShoppingContainer = (
    emptyBasket: boolean
  ): React.ReactNode => {
    return (
      <motion.div
        layout="position"
        initial={emptyBasket && isEmptyThroughDeletion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        whileHover={{
          color: "var(--color-brand-colour-2)",
          transition: { duration: 0.2 },
        }}
        transition={{
          delay: isEmptyThroughDeletion && !emptyBasket ? 0.2 : 0,
          ease: easeInOutExpo,
          duration: 0.6,
        }}
        className={`flex place-content-center ${
          emptyBasket ? "mt-0 text-2xl" : "mt-10"
        }`}
      >
        <Link to="/products">
          {emptyBasket ? "Have a look at our products" : "Continue shopping"}
        </Link>
      </motion.div>
    );
  };

  return (
    <LayoutGroup>
      <motion.div
        layout
        initial={false}
        className="relative min-h-[500px] w-full"
      >
        <AnimatePresence mode="wait">
          {state.items.length === 0 ? (
            <div className="w-screen min-h-[calc((100svh-220px)/2)] flex flex-col items-center justify-end">
              <VerticalCutAnimatedText
                text="Your basket is empty :("
                splitType="word"
                className="text-[clamp(4rem,9vw,6rem)] font-outfit"
                playAnimation={isEmptyThroughDeletion}
              />
              {createContinueShoppingContainer(true)}
            </div>
          ) : (
            <motion.div
              key="basket-content"
              className="space-y-4 mx-auto w-[clamp(40ch,70%,70ch)]"
              layout="position"
              exit={{ opacity: 0 }}
            >
              <AnimatePresence mode="popLayout">
                {state.items.map((item) => (
                  <BasketLineItem item={item} key={item.variantId} />
                ))}
              </AnimatePresence>
              <BasketFooter />
              {createContinueShoppingContainer(false)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
};
export default BasketPage;
