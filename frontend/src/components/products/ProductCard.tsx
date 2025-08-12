import { Link } from "react-router-dom";
import { ProductView } from "../../types/ProductListView";
import { formatPriceRange } from "../../utils/format";
import { getProductPath } from "../../utils/route";
import { getStableBGColor } from "../../utils/fun";

type ProductCardProps = {
  product: ProductView;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const minPrice = product.priceRange.min;
  const maxPrice = product.priceRange.max;

  return (
    <article className="relative isolate min-w-0">
      <div
        className={`${getStableBGColor(product.id)} w-full aspect-square`}
      ></div>
      <Link to={getProductPath(product)}>
        <span className="absolute inset-0 z-5"></span>
        <h2 className={`text-[1.1em]`}>{product.name}</h2>
      </Link>
      <span
        className={`font-extralight`}
        aria-label={`Price: ${formatPriceRange(minPrice, maxPrice)}`}
      >
        {formatPriceRange(minPrice, maxPrice)}
      </span>
    </article>
  );
};

export default ProductCard;
