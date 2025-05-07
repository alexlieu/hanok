import { Link, useRouteLoaderData } from "react-router-dom";
import { LoaderData } from "../../types/ProductListView";
import { formatNameToSlug } from "../../utils/format";

const ProductBreadcrumb: React.FC<{ category: string }> = ({ category }) => {
  const { categoryCounts } = useRouteLoaderData("all-products") as LoaderData;
  const displayName =
    categoryCounts?.find(({ category: cat }) => cat === category)
      ?.displayName ?? "";

  return (
    <Link to={`/products/${formatNameToSlug(displayName)}`}>{category}</Link>
  );
};

export default ProductBreadcrumb;
