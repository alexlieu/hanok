import { ProductView } from "../../types/ProductListView";
import { Link } from "react-router-dom";
import { formatPriceRange } from "../../utils/format";
import { getProductPath } from "../../utils/route";

type ProductCardProps = {
    product: ProductView
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const minPrice = product.priceRange.min;
    const maxPrice = product.priceRange.max;

    return (
        <article>
            <Link to={getProductPath(product)}>
                <div className={`bg-gray-200 w-full aspect-square`}></div>
                <h2 className={`text-[1.1em]`}>{product.name}</h2>
                <span className={`font-extralight`} aria-label={`Price: ${formatPriceRange(minPrice, maxPrice)}`}>
                    {formatPriceRange(minPrice, maxPrice)}
                </span>
            </Link>
        </article>
    );
}

export default ProductCard;