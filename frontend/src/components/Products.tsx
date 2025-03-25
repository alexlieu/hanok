import { useState, useEffect } from "react";
import ErrorType from "../types/ErrorType";
import { ProductView } from "../types/ProductListView";
import ProductsFilter from "./ProductsFilter";

const uniqueCategoryFilter = (productsArray: ProductView[]) => {
    const uniqueCategories = [...new Set(productsArray.map(p => p.category))];
    const categoryCounts = productsArray.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return uniqueCategories.map(category => ({
        category,
        count: categoryCounts[category]
    }));
}

const Products: React.FC = () => {
    const [fetching, setIsFetching] = useState(false);
    const [products, setProducts] = useState<ProductView[]>([])
    const [error, setError] = useState<ErrorType>(null)

    useEffect(() => {
        async function fetchProducts() {
            try {
                setIsFetching(true)
                const response = await fetch("http://localhost:8080/api/products")
                const resData = await response.json()
                if (!response.ok) throw new Error()
                setProducts(resData)
            } catch (error) {
                if (error instanceof Error) setError(error)
                else setError(new Error('An unknown error occured')) 
            }
            setIsFetching(false)
        }
        fetchProducts()
    }, [])

    const handleFilterSelection = (selectionOption: string | null) => {
        console.log(`Selected option: `, selectionOption)
    }

    return (
        <>
            <ProductsFilter
                options = {uniqueCategoryFilter(products)}
                onChange = {handleFilterSelection}
            />
            {fetching && <p>Fetching products...</p>}
            {( !fetching && products.length === 0 ) && <p>Issue fetching products</p>}
            {products.length > 0 && (
                <ul className="grid grid-cols-3 gap-4">
                    {products.map((product) => (
                        <li key={`${product.name}-${product.id}`}>
                            <h3>{product.name}</h3>
                            <h3>{product.price}</h3>
                            <p>{product.category.toLowerCase()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default Products;