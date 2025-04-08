import { useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";
import { LoaderData, ProductView } from "../types/ProductListView";
import ProductCard from "./ProductCard";
import { filterCategoryCount } from "../utils/filter";

const ProductsList: React.FC = () => {
    const { categorySlug } = useParams();
    const productsInCategory = useLoaderData() as ProductView[];
    const { allProducts, categoryCounts } = useRouteLoaderData('all-products') as LoaderData;
    
    const products = categorySlug ? productsInCategory : allProducts;
    
    if (!products || products.length === 0) return <div>No products found.</div>;
    
    return (
        <div
            className="grid grid-cols-3 max-w-4xl mx-auto gap-4 pt-10"
        >
            {products.map( p => ( 
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}

export default ProductsList;