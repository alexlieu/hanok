import { useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";
import CategoryList from "../components/products/CategoryList";
import ProductsGrid from "../components/products/ProductsGrid";
import { LoaderData, ProductView } from "../types/ProductListView";
import { useMemo } from "react";
import DropDown from "../components/ui/DropDown";
import { useProductSort } from "../utils/hooks";

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

  return (
    <>
      <DropDown
        options={sortOptions}
        handleSelect={sortBy}
        currentSort={currentSort}
      />
      <CategoryList />
      <ProductsGrid products={sortedProducts} />
    </>
  );
};

export default ProductsPage;
