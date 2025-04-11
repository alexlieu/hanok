import { useState } from "react";
import { Selection as OrderSelection } from "./features/product/useOrderSelection";
import { variant } from "../../types/ProductDetailView";

type OrderItem = {
  id: number;
  quantity: number;
};

const useAddToBasket = (
  selectedOptions: OrderSelection,
  variations: variant[]
) => {
  const [addToBasket, setAddToBasket] = useState<OrderItem>();

  const handleAddToBasket = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAddToBasket({
      id: variations.find(
        (v) =>
          v.flavour === selectedOptions.flavour &&
          v.size === selectedOptions.size
      )!.id,
      quantity: selectedOptions.quantity,
    });
  };

  return {
    addToBasket,
    handleAddToBasket,
  };
};

export default useAddToBasket;
