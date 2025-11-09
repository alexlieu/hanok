import { BasketResponse } from "./BasketTypes";
import { ConfiguredPickupRules } from "./ConfigTypes";

export type CheckoutRequiredData = {
  pickupRules: ConfiguredPickupRules;
  basketContent: BasketResponse;
  validStatesProvincesRegions: {
    US_STATES: Record<string, string>;
    CA_PROVINCES: Record<string, string>;
    KR_PROVINCES: Set<string>;
  };
};
