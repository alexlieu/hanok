import { useRouteLoaderData } from "react-router-dom";
import { LoaderData } from "../types/ProductListView";
import ProductCard from "./ProductCard";

const ProductsList: React.FC = () => {
    const { allProducts, categoryCounts } = useRouteLoaderData('all-products') as LoaderData;

    if (!allProducts || allProducts.length === 0) return <div>No products found.</div>;

    return (
        <div
            className="grid grid-cols-3 max-w-4xl mx-auto gap-4 pt-10"
        >
            {allProducts.map( p => ( 
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}

export default ProductsList;