import { useState, useEffect } from "react";
import ErrorType from "../types/ErrorType";
import { ProductView } from "../types/ProductListView";

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

    return (
        <>
            {fetching && <p>Fetching products...</p>}
            {( !fetching && products.length === 0 ) && <p>Issue fetching products</p>}
            {products.length > 0 && (
                <ul>
                    {products.map((product) => (
                        <li>
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