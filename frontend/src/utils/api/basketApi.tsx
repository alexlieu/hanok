import { BasketResponse } from "../../types/BasketTypes";
import { APIResponseError } from "../../types/ErrorType";
import { API_BASE_URL } from "./apiClient";

const getBasketResponse = async (
  ids: number[],
  quantities: number[]
): Promise<BasketResponse> => {
  const itemIdsQuery = ids.map((i) => `itemIds=${i}`).join("&");
  const itemQuantitiesQuery = quantities
    .map((i) => `quantities=${i}`)
    .join("&");
  const queryString = [itemIdsQuery, itemQuantitiesQuery]
    .filter(Boolean)
    .join("&");
  const response = await fetch(
    `${API_BASE_URL}/orders/basket?${queryString}`
  );
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorResponse: APIResponseError = await response.json();
      errorMessage = errorResponse.message || errorMessage;
    } catch (e) {
      console.error("Failed to parse error response JSON:", e);
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export default getBasketResponse;
