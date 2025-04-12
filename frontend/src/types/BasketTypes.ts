export type BasketItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type BasketState = {
  items: BasketItem[];
  total: number;
};

export type BasketAction =
  | { type: "ADD_ITEM"; payload: BasketItem }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "UPDATE_QUANTITY"; id: number; quantity: number }
  | { type: "CLEAR" };
