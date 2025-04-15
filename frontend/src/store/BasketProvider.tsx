import { useReducer } from "react";
import { BasketState, BasketAction, BasketItem } from "../types/BasketTypes";
import { BasketStateContext, BasketDispatchContext } from "./BasketContext";

const basketReducer = (
  state: BasketState,
  action: BasketAction
): BasketState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      const maxQuantity = 10;
      if (existingItem) {
        const newQuantity =
          Number(existingItem.quantity) + Number(action.payload.quantity);
        if (newQuantity > maxQuantity) {
          return {
            ...state,
          };
        }
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity:
                  Number(item.quantity) + Number(action.payload.quantity),
              }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calculatedTotal(updatedItems),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.quantity * action.payload.price,
      };
    }
    case "REMOVE_ITEM": {
      const itemToRemove = state.items.find((item) => item.id === action.id);
      const newTotal = itemToRemove
        ? state.total - itemToRemove.price * itemToRemove.quantity
        : state.total;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
        total: parseFloat(newTotal.toFixed(2)),
      };
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
      const newTotal = calculatedTotal(updatedItems);
      return {
        ...state,
        items: updatedItems,
        total: newTotal,
      };
    }
    case "CLEAR":
      return { items: [], total: 0 };
    default:
      return state;
  }
};

type BasketProviderProps = {
  children: React.ReactNode;
};

export const BasketProvider: React.FC<BasketProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(basketReducer, { items: [], total: 0 });

  return (
    <BasketStateContext.Provider value={state}>
      <BasketDispatchContext.Provider value={dispatch}>
        {children}
      </BasketDispatchContext.Provider>
    </BasketStateContext.Provider>
  );
};

const calculatedTotal = (items: BasketItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
