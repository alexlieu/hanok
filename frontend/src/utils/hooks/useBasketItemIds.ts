import { useMemo } from "react";
import { useBasketState } from "./store/useBasket";

export const useBasketItemsIds = () => {
  const { items } = useBasketState();
  const memoizedItems = useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }
    return items.map((i) => ({ id: i.id, quantity: i.quantity }));
  }, [items]);
  return memoizedItems;
};
