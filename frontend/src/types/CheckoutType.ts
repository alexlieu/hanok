import { BasketResponse } from "./BasketTypes";
import { PickupRules } from "./ConfigTypes";

export type CheckoutRequiredData = {
  pickupRules: PickupRules | null;
  basketContent: BasketResponse;
};
