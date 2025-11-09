import {
  OrderRequest,
  OrderSuccessRawResponse,
  PaymentMethod,
} from "../types/order.types";
import { api } from "../utils/api/apiClient";

export const createOrder = async (
  order: OrderRequest,
  paymentMethod: PaymentMethod
) => {
  return await api.post<OrderSuccessRawResponse>(
    `/orders/${paymentMethod === "CARD" ? "card" : "tokenized"}-payment`,
    order
  );
};
