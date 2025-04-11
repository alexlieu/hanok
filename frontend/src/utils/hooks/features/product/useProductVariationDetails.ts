import { useMemo } from "react";
import { variant } from "../../../../types/ProductDetailView";

const useProductVariationDetails = (variations: variant[]) => {
  return useMemo(() => {
    const sizes = new Set<string>();
    const flavours = new Set<string>();
    const priceMap: Record<string, number> = {};

    variations.forEach((v) => {
      sizes.add(v.size);
      flavours.add(v.flavour);
      const key = `${v.size}|${v.flavour}`;
      priceMap[key] = v.price;
    });

    return {
      sizes: [...sizes],
      flavours: [...flavours],
      getPrice: (size: string, flavour: string) => {
        const key = `${size}|${flavour}`;
        return priceMap[key] ?? null;
      },
    };
  }, [variations]);
};

export default useProductVariationDetails;
