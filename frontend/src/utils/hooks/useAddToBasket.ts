import { Selection as OrderSelection } from "./features/product/useOrderSelection";
import { variant } from "../../types/ProductDetailView";
import { useBasketDispatch } from "./store/useBasket";
import { useLocation } from "react-router-dom";

const useAddToBasket = (
  selectedOptions: OrderSelection,
  name: string,
  variations: variant[]
) => {
  const dispatch = useBasketDispatch();
  const location = useLocation();

  const handleAddToBasket = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const itemToAdd = variations.find(
      (v) =>
        v.flavour === selectedOptions.flavour && v.size === selectedOptions.size
    );
    if (!itemToAdd) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: itemToAdd.id,
        name: name,
        flavour: itemToAdd.flavour,
        size: itemToAdd.size,
        price: itemToAdd.price,
        quantity: selectedOptions.quantity,
        url: location.pathname,
      },
    });
  };

  return {
    handleAddToBasket,
  };
};

export default useAddToBasket;
