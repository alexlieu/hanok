import { ProductView } from "../../types/ProductListView";
import ProductCard from "./ProductCard";

type ProductsGrid = {
  products: ProductView[] | null;
};

const ProductsGrid: React.FC<ProductsGrid> = ({ products }) => {
  if (!products || products.length === 0) return <div>No products found.</div>;

  return (
    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductsGrid;
