import { Link, useRouteLoaderData } from "react-router-dom";
import { LoaderData } from "../../types/ProductListView";
import { formatNameToSlug } from "../../utils/format";

type ProductBreadcrumbProps = {
  product: string;
  category: string;
  className?: string;
};

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({
  product,
  category,
  className,
}) => {
  const { categoryCounts } = useRouteLoaderData("all-products") as LoaderData;
  const displayName =
    categoryCounts?.find(({ category: cat }) => cat === category)
      ?.displayName ?? "";

  return (
    <span className={className}>
      <Link to={"/products"} className="hover:underline underline-offset-5">
        products
      </Link>
      <span className="px-2">/</span>
      <Link
        to={`/products/${formatNameToSlug(displayName)}`}
        className="hover:underline underline-offset-5"
      >
        {displayName}
      </Link>
      <span className="px-2">/</span>
      <p className="truncate">{product}</p>
    </span>
  );
};

export default ProductBreadcrumb;
