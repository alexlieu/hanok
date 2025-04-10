import { useEffect, useState } from "react";
import { ProductView } from "../types/ProductListView";
import { sortProducts } from "./sort";

export const useProductSort = (
  unsortedProducts?: ProductView[],
  defaultSort: string
) => {
  const [sortedProducts, setSortedProducts] = useState<ProductView[]>([]);
  const [sortOption, setSortOption] = useState(defaultSort);

  useEffect(() => {
    const products = unsortedProducts || [];
    setSortedProducts(sortProducts(products, sortOption));
  }, [unsortedProducts, sortOption]);

  return {
    sortedProducts,
    sortBy: setSortOption,
    currentSort: sortOption,
  };
};
