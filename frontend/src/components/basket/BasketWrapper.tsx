import { useEffect, useState, Fragment } from "react";
import { useBasketItemsIds } from "../../utils/hooks/useBasketItemIds";
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

const BasketWrapper: React.FC = () => {
  const [loaderData, setLoaderData] = useState<BasketResponse | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const basketItems = useBasketItemsIds();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (basketItems && basketItems.length > 0) {
          const ids = basketItems.map((i) => i.id);
          const quantities = basketItems.map((i) => i.quantity);
          const data = await getBasketResponse(ids, quantities);
          setLoaderData(data);
        } else {
          setLoaderData(null);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err == "string") {
          setError(err);
        } else {
          setError("An unexpected error occured while fetching basket data");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [basketItems]);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {loaderData?.items.map((item) => (
        <Fragment key={item.variantId || item.productName}>
          <p>{item.productName}</p>
          <p>{item.quantity}</p>
        </Fragment>
      ))}
    </>
  );
};

export default BasketWrapper;
