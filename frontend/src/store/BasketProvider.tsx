import { useReducer } from "react";
import { BasketState, BasketAction } from "../types/BasketTypes";
import { BasketContext } from "./BasketContext";

const basketReducer = (
  state: BasketState,
  action: BasketAction
): BasketState => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.quantity * action.payload.quantity,
      };
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
      const newTotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
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
    <BasketContext.Provider value={{ state, dispatch }}>
      {children}
    </BasketContext.Provider>
  );
};
