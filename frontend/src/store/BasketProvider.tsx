import { useCallback, useEffect, useReducer } from "react";
import {
  BasketState,
  BasketAction,
  BasketItem,
  BasketResponse,
} from "../types/BasketTypes";
import { BasketStateContext, BasketDispatchContext } from "./BasketContext";
import getBasketResponse from "../utils/api/basketApi";

const basketReducer = (
  state: BasketState,
  action: BasketAction
): BasketState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.variantId === action.payload.variantId
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
          item.variantId === action.payload.variantId
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
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, subTotal: 0 }],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.variantId !== action.id),
      };
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.variantId === action.id
          ? { ...item, quantity: action.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
      };
    }
    case "CLEAR":
      return { items: [], total: 0 };
    case "SET_BASKET_FROM_BACKEND": {
      const newItemsFromBackend = action.payload.items.map((backendItem) => {
        const existingLocalItem = state.items.find(
          (localItem) => localItem.variantId === backendItem.variantId
        );
        return {
          variantId: backendItem.variantId,
          productName: backendItem.productName,
          flavour: backendItem.flavour,
          size: backendItem.size,
          quantity: backendItem.quantity,
          unitPrice: backendItem.unitPrice,
          subTotal: backendItem.subTotal,
          url: backendItem.url || existingLocalItem?.url || "",
        };
      });
      return {
        items: newItemsFromBackend,
        total: action.payload.total,
      };
    }
    // return {
    //   items: action.payload.items.map((item) => ({
    //     variantId: item.variantId,
    //     productName: item.productName,
    //     flavour: item.flavour,
    //     size: item.size,
    //     unitPrice: item.unitPrice,
    //     quantity: item.quantity,
    //     subTotal: item.subTotal,
    //     url: item.url || "",
    //   })),
    //   total: action.payload.total,
    // };
    default:
      return state;
  }
};

type BasketProviderProps = {
  children: React.ReactNode;
};

export const BasketProvider: React.FC<BasketProviderProps> = ({ children }) => {
  const getInitialState = (): BasketState => {
    try {
      const storedBasket = localStorage.getItem("guestBasket");
      if (storedBasket) {
        const parsedState = JSON.parse(storedBasket);
        if (parsedState && Array.isArray(parsedState.items)) {
          return parsedState;
        }
      }
    } catch (error) {
      console.error("Error parsing basket from localStorage:", error);
      localStorage.removeItem("guestBasket");
    }
    return { items: [], total: 0 };
  };

  const [state, localDispatch] = useReducer(basketReducer, {}, getInitialState);

  useEffect(() => {
    localStorage.setItem("guestBasket", JSON.stringify(state));
  }, [state]);

  const dispatch: React.Dispatch<BasketAction> = useCallback(
    async (action: BasketAction) => {
      localDispatch(action);

      let itemsForBackend: BasketItem[] = [];

      if (action.type === "ADD_ITEM") {
        const existingItem = state.items.find(
          (item) => item.variantId === action.payload.variantId
        );
        if (existingItem) {
          itemsForBackend = state.items.map((item) =>
            item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          );
        } else {
          itemsForBackend = [
            ...state.items,
            { ...action.payload, subTotal: 0 },
          ];
        }
      } else if (action.type === "REMOVE_ITEM") {
        itemsForBackend = state.items.filter(
          (item) => item.variantId !== action.id
        );
      } else if (action.type === "UPDATE_QUANTITY") {
        itemsForBackend = state.items.map((item) =>
          item.variantId === action.id
            ? { ...item, quantity: action.quantity }
            : item
        );
      } else if (action.type === "CLEAR") {
        itemsForBackend = [];
      } else if (action.type === "SET_BASKET_FROM_BACKEND") {
        return;
      } else {
        console.warn("Unhandled action type for backend sync:", action["type"]);
        return;
      }

      const validItemForBackend = itemsForBackend.filter(
        (item) => item.quantity > 0
      );

      if (validItemForBackend.length === 0) {
        localDispatch({
          type: "SET_BASKET_FROM_BACKEND",
          payload: { items: [], total: 0 },
        });
        return;
      }

      const ids = validItemForBackend.map((item) => item.variantId);
      const quantities = validItemForBackend.map((item) => item.quantity);

      try {
        const backendBasket: BasketResponse = await getBasketResponse(
          ids,
          quantities
        );
        console.log("Backend Basket Response from dispatch: ", backendBasket);
        localDispatch({
          type: "SET_BASKET_FROM_BACKEND",
          payload: backendBasket,
        });
      } catch (error) {
        console.error(
          "Failed to sync basket with backend after update: ",
          error
        );
        try {
          const currentBackendBasket = await getBasketResponse(
            state.items.map((item) => item.variantId),
            state.items.map((item) => item.quantity)
          );
          localDispatch({
            type: "SET_BASKET_FROM_BACKEND",
            payload: currentBackendBasket,
          });
        } catch (revertError) {
          console.error("Failed to re-sync after error: ", revertError);
        }
      }
    },
    [state]
  );

  return (
    <BasketStateContext.Provider value={state}>
      <BasketDispatchContext.Provider value={dispatch}>
        {children}
      </BasketDispatchContext.Provider>
    </BasketStateContext.Provider>
  );
};
