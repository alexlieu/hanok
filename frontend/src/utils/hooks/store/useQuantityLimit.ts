import { useBasketState } from "./useBasket";
export const useQuantityLimit = (productId: number) => {
  const state = useBasketState();
  const item = state.items.find((item) => item.id === productId);
  const maxQuantity = 10;

  return {
    currentQuantity: item?.quantity || 0,
    maxQuantity,
    isAtLimit: item ? item.quantity >= maxQuantity : false,
  };
};
