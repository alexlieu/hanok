import { use } from "react";
import {
  BasketDispatchContext,
  BasketStateContext,
} from "../../../store/BasketContext";

export function useBasket() {
  const state = use(BasketStateContext);
  const dispatch = use(BasketDispatchContext);
  if (!state || !dispatch)
    throw new Error("useBasket must be used within BasketProvider");
  return { state, dispatch };
}

export function useBasketState() {
  const state = use(BasketStateContext);
  if (!state)
    throw new Error("useBasketState must be used within BasketProvider");
  return state;
}

export function useBasketDispatch() {
  const dispatch = use(BasketDispatchContext);
  if (!dispatch)
    throw new Error("useBasketDispatch must be used within BasketProvider");
  return dispatch;
}
