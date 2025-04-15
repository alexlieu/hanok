import { createContext } from "react";
import { BasketState, BasketAction } from "../types/BasketTypes";

export const BasketContext = createContext<
  { state: BasketState; dispatch: React.Dispatch<BasketAction> } | undefined
>(undefined);

export const BasketStateContext = createContext<BasketState | undefined>(
  undefined
);
export const BasketDispatchContext = createContext<
  React.Dispatch<BasketAction> | undefined
>(undefined);
