import { BasketResponse } from "./BasketTypes";
import { PickupRules } from "./ConfigTypes";

export type CheckoutRequiredData = {
  pickupRules: PickupRules;
  basketContent: BasketResponse;
};
