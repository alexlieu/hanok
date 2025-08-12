import { BasketItem } from "../types/BasketTypes";

const getBasketFromLocalStorage = (): BasketItem[] => {
  let basketItems: BasketItem[] = [];
  try {
    const storedBasket = localStorage.getItem("guestBasket");
    if (storedBasket) {
      const parsedState = JSON.parse(storedBasket);
      if (parsedState && Array.isArray(parsedState.items)) {
        basketItems = parsedState.items;
      }
    }
  } catch (error) {
    console.error(
      "Failed to parse basket items from localStorage in loader",
      error
    );
    localStorage.removeItem("guestBasket");
  }
  return basketItems;
};

export default getBasketFromLocalStorage;
