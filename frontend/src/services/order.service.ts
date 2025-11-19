import { parseAbsoluteToLocal, parseDate } from "@internationalized/date";
import {
  OrderRequest,
  OrderResponse,
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

export const transformOrderResponse = (
  rawResponse: OrderSuccessRawResponse
): OrderResponse => {
  return {
    orderStatus: rawResponse.orderStatus,
    orderNumber: rawResponse.orderNumber,
    paymentMethod: rawResponse.paymentMethod,
    maskedCardNo: rawResponse.maskedCardNo,
    orderItems: rawResponse.orderItems.map((item) => ({
      productName: item.productName,
      variantConfig: item.variantConfig,
      unitPrice: item.unitPrice.toString(),
      quantity: item.quantity,
      itemTotal: item.itemTotal.toString(),
    })),
    total: rawResponse.total.toString(),
    specialInstructions: rawResponse.specialInstructions,
    customerName: rawResponse.customerName,
    email: rawResponse.email,
    phoneNumber: rawResponse.phoneNumber,
    pickupDateTime: parseDate(rawResponse.pickupDateTime),
    pickupSlot: rawResponse.pickupSlot,
    orderDateTime: parseAbsoluteToLocal(rawResponse.orderDateTime),
  };
};
