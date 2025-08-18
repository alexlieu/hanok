import { BasketResponse } from "./BasketTypes";
import { ConfiguredPickupRules } from "./ConfigTypes";

export type CheckoutRequiredData = {
  pickupRules: ConfiguredPickupRules;
  basketContent: BasketResponse;
};
