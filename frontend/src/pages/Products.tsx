import { useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";
import CategoryList from "../components/products/CategoryList";
import ProductsGrid from "../components/products/ProductsGrid";
import { LoaderData, ProductView } from "../types/ProductListView";
import { useMemo } from "react";
import DropDown from "../components/ui/DropDown";
import useProductSort from "../utils/hooks/features/product/useProductSort";

const sortOptions = ["Name (A-Z)", "Price (Low to High)", "Just Added"];

const ProductsPage: React.FC = () => {
  const { categorySlug } = useParams();
  const productsInCategory = useLoaderData() as ProductView[];
  const { allProducts } = useRouteLoaderData("all-products") as LoaderData;

  const unsortedProducts = useMemo(
    () => (categorySlug ? productsInCategory ?? [] : allProducts ?? []),
    [categorySlug, productsInCategory, allProducts]
  );

  const { sortedProducts, sortBy, currentSort } = useProductSort(
    unsortedProducts,
    sortOptions[0]
  );

  const WIDTH = 190;

  return (
    <>
      <div className={`grid grid-rows-[auto-auto]`}>
        <div
          className={`flex flex-col sm:flex-row justify-between max-w-[${WIDTH}ch] min-w-[226px] mx-auto w-full px-4 py-4`}
        >
          <CategoryList />
          <DropDown
            options={sortOptions}
            handleSelect={sortBy}
            currentSort={currentSort}
          />
        </div>
        <div className={`max-w-[${WIDTH}ch] mx-auto w-full px-4`}>
          <ProductsGrid products={sortedProducts} />
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
