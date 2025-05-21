export type BasketRequest = {
  itemIds: number[];
  quantities: number[];
};

export type BasketResponseItem = {
  productName: string;
  flavour: string;
  size: string;
  unitPrice: number;
  subTotal: number;
  variantId: number;
  quantity: number;
  url?: string;
};

export type BasketResponse = {
  items: BasketResponseItem[];
  total: number;
};

export type BasketItem = {
  variantId: number;
  productName: string;
  flavour: string;
  size: string;
  unitPrice: number;
  quantity: number;
  url: string;
  subTotal: number;
};

export type BasketState = {
  items: BasketItem[];
  total: number;
};

export type BasketAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<BasketItem, "subTotal"> & { url: string };
    }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "UPDATE_QUANTITY"; id: number; quantity: number }
  | { type: "CLEAR" }
  | { type: "SET_BASKET_FROM_BACKEND"; payload: BasketResponse };
