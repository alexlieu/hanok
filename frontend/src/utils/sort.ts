import { ProductView } from "../types/ProductListView";

const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const sortProducts = (
  unsortedProducts: ProductView[],
  sortOption: string
): ProductView[] => {
  const productsCopy = [...unsortedProducts];
  switch (sortOption) {
    case "Name (A-Z)":
      return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case "Price (Low to High)":
      return productsCopy.sort((a, b) => a.priceRange.min - b.priceRange.min);
    case "Just Added":
      return productsCopy.sort((a, b) => b.id - a.id);
    case "Shuffle":
      return shuffle(productsCopy);
    default:
      return productsCopy;
  }
};
