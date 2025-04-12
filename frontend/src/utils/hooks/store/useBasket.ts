import { useContext } from "react";
import { BasketContext } from "../../../store/BasketContext";

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used within BasketProvider");
  return context;
}
