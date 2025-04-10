import { ProductView } from "../../types/ProductListView";
import ProductCard from "./ProductCard";

type ProductsGrid = {
    products: ProductView[] | null;
};

const ProductsGrid: React.FC<ProductsGrid> = ({products}) => {
    
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

export default ProductsGrid;