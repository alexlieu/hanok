import { BasketResponse } from "../../types/BasketTypes";
import { APIResponseError } from "../../types/ErrorType";

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
    `http://localhost:8080/api/orders/basket?${queryString}`
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
