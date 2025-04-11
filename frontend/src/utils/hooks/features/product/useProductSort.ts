import { useEffect, useState } from "react";
import { ProductView } from "../../../../types/ProductListView";
import { sortProducts } from "../../../sort";

const useProductSort = (
  unsortedProducts: ProductView[],
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

export default useProductSort;
