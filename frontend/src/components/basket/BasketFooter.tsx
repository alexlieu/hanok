import { formatPrice } from "../../utils/format";
import { useBasketState } from "../../utils/hooks/store/useBasket";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { easeInOutExpo } from "../../utils/ease";

const BasketFooter: React.FC = () => {
  const state = useBasketState();
  return (
    <motion.div
      layout="position"
      transition={{ ease: easeInOutExpo, duration: 0.6 }}
      className="grid justify-items-end p-4 gap-3"
    >
      <div className="justify-items-end">
        <p className="text-gray-600">Subtotal</p>
        <p className="text-xl">{`${formatPrice(state.total)}`}</p>
      </div>
      <Link
        to=""
        className={`w-fit text-2xl font-medium px-4 py-2 border-black border-1 transition-colors hover:text-white hover:bg-black`}
        aria-label={`Proceed to checkout, total ${formatPrice(state.total)}`}
      >
        Checkout
      </Link>
    </motion.div>
  );
};

export default BasketFooter;
