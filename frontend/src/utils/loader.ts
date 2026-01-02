import { LoaderFunctionArgs } from "react-router-dom";
import { LoaderData } from "../types/ProductListView";
import { ProductView } from "../types/ProductListView";
import { productInfo } from "../types/ProductDetailView";
import { BasketResponse, BasketItem } from "../types/BasketTypes";
import { CheckoutRequiredData } from "../types/CheckoutType";
import getBasketFromLocalStorage from "./getBasketFromLocalStorage";
import getBasketResponse from "./api/basketApi";
import {
  getPickupRules,
  getValidStatesProvincesRegions,
} from "./api/checkoutApi";
import { getLocalTimeZone, now, today } from "@internationalized/date";
import { ConfiguredPickupRules } from "../types/ConfigTypes";
import { API_BASE_URL } from "./api/apiClient";

export const productsLoader = async (): Promise<LoaderData> => {
  try {
    const [allProducts, categoryCounts] = await Promise.all([
      fetch(`${API_BASE_URL}/products`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      fetch(`${API_BASE_URL}/products/categories`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ]);
    if (!allProducts || !categoryCounts) {
      throw new Response(JSON.stringify({ message: "Partial data failure." }), {
        status: 500,
      });
    }
    return { allProducts, categoryCounts };
  } catch (error) {
    console.error("Failed to fetch products.", error);
    throw new Response(
      JSON.stringify({ message: "Failed to fetch products." }),
      {
        status: 500,
      }
    );
  }
};

export const productsByCategoryLoader = async ({
  params,
}: LoaderFunctionArgs<"categorySlug">): Promise<ProductView[]> => {
  const categorySlug = params.categorySlug;
  const response = await fetch(
    `${API_BASE_URL}/products?category=${categorySlug}`
  );
  if (!response.ok)
    throw new Response(
      JSON.stringify({ message: `Failed to fetch products.` }),
      {
        status: 500,
      }
    );
  return await response.json();
};

export const productLoader = async ({
  params,
}: LoaderFunctionArgs<"productSlug">): Promise<productInfo> => {
  try {
    const slug = params.productSlug;
    const response = await fetch(
      `${API_BASE_URL}/products/by-slug/${slug}`
    );
    if (!response.ok) {
      throw new Response(JSON.stringify({ message: "Product not found." }), {
        status: 404,
      });
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load product", error);
    throw new Response(JSON.stringify({ message: "Failed to load product." }), {
      status: 500,
    });
  }
};

export const basketLoader = async (): Promise<BasketResponse> => {
  const basketItems: BasketItem[] = getBasketFromLocalStorage();

  if (basketItems.length === 0) {
    return { items: [], total: 0 };
  }

  const ids = basketItems.map((item) => item.variantId);
  const quantities = basketItems.map((item) => item.quantity);

  try {
    const response = await getBasketResponse(ids, quantities);
    console.log("Backend Basket Response in Loader: ", response);
    return response;
  } catch (error) {
    console.error("Error loading basket items from backend in loader", error);
    throw error;
  }
};

export const checkoutLoader = async (): Promise<CheckoutRequiredData> => {
  const basketItems = getBasketFromLocalStorage();

  if (basketItems.length === 0) {
    return {
      pickupRules: {
        firstValidDate: today(getLocalTimeZone()).add({ days: 3 }),
        lastValidDate: today(getLocalTimeZone()).add({ days: 3, months: 3 }),
        isHoliday: () => false,
        receivedAt: now(getLocalTimeZone()),
        unavailableDates: [],
        pickupSlots: [],
        openingHours: [],
      } as ConfiguredPickupRules,
      basketContent: { items: [], total: 0 } as BasketResponse,
      validStatesProvincesRegions: {
        US_STATES: {},
        CA_PROVINCES: {},
        KR_PROVINCES: new Set(),
      },
    };
  }

  const ids = basketItems.map((item) => item.variantId);
  const quantities = basketItems.map((item) => item.quantity);

  try {
    const [
      basketResponse,
      pickupRulesResponse,
      { US_STATES, CA_PROVINCES, KR_PROVINCES },
    ] = await Promise.all([
      await getBasketResponse(ids, quantities),
      await getPickupRules(),
      await getValidStatesProvincesRegions(),
    ]);
    console.log("US_STATES: ", US_STATES);
    console.log("CA_PROVINCES: ", CA_PROVINCES);
    console.log("KR_PROVINCES: ", KR_PROVINCES);
    return {
      pickupRules: pickupRulesResponse,
      basketContent: basketResponse,
      validStatesProvincesRegions: {
        US_STATES,
        CA_PROVINCES,
        KR_PROVINCES,
      },
    };
  } catch (error) {
    console.error("Error fetching checkout data: ", error);
    throw error;
  }
};
