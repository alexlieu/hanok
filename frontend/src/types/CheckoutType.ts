import { BasketResponse } from "./BasketTypes";
import { ConfiguredPickupRules } from "./ConfigTypes";

export type CheckoutRequiredData = {
  pickupRules: ConfiguredPickupRules;
  basketContent: BasketResponse;
  validStatesProvincesRegions: {
    US_STATES: Set<string>;
    CA_PROVINCES: Set<string>;
    KR_PROVINCES: Set<string>;
  };
};
