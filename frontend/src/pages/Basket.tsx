import { Link } from "react-router-dom";
import { useBasketState } from "../utils/hooks/store/useBasket";
import BasketLineItem from "../components/basket/BasketLineItem";
import { formatPrice } from "../utils/format";

const BasketPage: React.FC = () => {
  const state = useBasketState();

  return (
    <>
      {state.items.length === 0 ? (
        <h2 className="text-9xl text-center">{`Your basket is empty :(`}</h2>
      ) : (
        <>
          <div role="list" className={`space-y-4 grid place-content-center`}>
            {state.items.map((item) => (
              <BasketLineItem item={item} key={item.id} />
            ))}
            <div className="grid justify-items-end p-4 gap-3">
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
            </div>
          </div>
        </>
      )}
      <div className="flex place-content-center pt-10">
        <Link to={`/products`}>Continue shopping</Link>
      </div>
    </>
  );
};
export default BasketPage;
