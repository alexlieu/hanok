import { Link } from "react-router-dom";
import { formatNameToSlug } from "../../utils/format";

const ProductBreadcrumb:React.FC<{category: string}> = ({category}) => (
    <Link to={`/products/${formatNameToSlug(category)}`}>
        {category}
    </Link>
);

export default ProductBreadcrumb;