import { useState, useEffect } from "react";
import ErrorType from "../types/ErrorType";
import { ProductView } from "../types/ProductListView";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";

const getUniqueCategories = (productsArray: ProductView[]) => {
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

export const formatPrice = (value: number) => {
   return (value % 1 != 0) ? `£${value}` : `£${value}.00`;
}

interface FilterOptions {
    category?: string;
    priceRange?: {min: string, max: string | null};
    available?: boolean;
    sortBy?: string;
    sortDir?: string;
}

const Products: React.FC = () => {
    const [fetching, setIsFetching] = useState(false);
    const [products, setProducts] = useState<ProductView[]>([]);
    const [categories, setCategories] = useState<{category: string, count: number}[]>([]);
    const [error, setError] = useState<ErrorType>(null);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

    useEffect(() => {
        fetchAllProducts();
    }, [])

    const handleCategoryFilter = (selectedCategory: string | null) => {
        if (selectedCategory) fetchFilteredProducts(selectedCategory);
        else fetchAllProducts();
    }

    const handlePriceFilter = (selectedPriceRange: {min: string, max: string | null} | null) => {
        const min = selectedPriceRange?.min;
        const max = selectedPriceRange?.max;
        const maxFormat = max ? `-£${max}` : '+';
        const message = selectedPriceRange ? `£${min}${maxFormat}` : null; 
        console.log("Selected: "+message);
        min ? setFilterOptions(prevState => ( 
                { ...prevState, priceRange: {min: selectedPriceRange!.min, max: selectedPriceRange!.max} } 
            ))
            : setFilterOptions(prevState => {
                const {priceRange, ...rest} = prevState;
                return rest;
            });
    }

    const fetchFilteredProducts = async (selectedCategory: string) => {
        try {
            setIsFetching(true);
            const query = new URLSearchParams({cat : selectedCategory});
            const response = await fetch(`http://localhost:8080/api/products?${query}`);
            const resData = await response.json();
            setProducts(resData);
        } catch (error) {
            if (error instanceof Error) setError(error);
            else setError(new Error('An unknown error occurred'));
        }
        setIsFetching(false);
    }

    const fetchAllProducts = async () => {
        try {
            setIsFetching(true);
            const response = await fetch('http://localhost:8080/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
            setCategories(getUniqueCategories(data));
        } catch (error) {
            if (error instanceof Error) setError(error);
            else setError(new Error('An unknown error occurred'));
        }
        setIsFetching(false);
    }

    return (
        <>
            <CategoryFilter
                options = {categories}
                onChange = {handleCategoryFilter}
            />
            <PriceFilter 
                onChange={handlePriceFilter}
            />
            <p>{filterOptions.priceRange?.min + '-' + filterOptions.priceRange?.max}</p>
            {( !fetching && products.length === 0 ) && <p>Issue fetching products</p>}
            {products.length > 0 && (
                <ul className="grid grid-cols-3 gap-4">
                    {products.map((product) => (
                        <li key={`${product.name}-${product.id}`} className="flex justify-evenly">
                            <h3>{product.name}</h3>
                            <h3>{formatPrice(product.price)}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default Products;