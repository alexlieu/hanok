import { useState, useEffect } from "react";
import ErrorType from "../types/ErrorType";
import { ProductView } from "../types/ProductListView";
import CategoryFilter from "../components/CategoryFilter";
import PriceFilter from "../components/PriceFilter";
import SortSelect from "../components/SortSelect";
import { useLoaderData } from "react-router-dom";

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

export const loader = async (): Promise<ProductView[]> => {
    const response = await fetch('http://localhost:8080/api/products');
    if (!response.ok){
        throw new Response(JSON.stringify({message: 'Could not fetch products.'}), {
            status: 500,
            headers: { "Content-Type": "application/json" },
         }); 
    }
    const data = await response.json();
    return data;
}

interface FilterOptions {
    cat?: string;
    min?: number;
    max?: number | null;
    available?: boolean;
    sortBy?: string;
    sortDir?: string;
}

const ProductsPage: React.FC = () => {
    const preloadProducts = useLoaderData<ProductView[]>();
    const [fetching, setIsFetching] = useState(false);
    const [products, setProducts] = useState<ProductView[]>(preloadProducts);
    const [categories, setCategories] = useState<{category: string, count: number}[]>(getUniqueCategories(preloadProducts));
    const [error, setError] = useState<ErrorType>(null);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

    useEffect(() => {
        if (Object.keys(filterOptions).length > 0) {
            fetchFilteredProducts();
            console.log(filterOptions);
        } else {
            fetchAllProducts();
            console.log('No Filter Options Selected.');
        }
    }, [filterOptions]);

    const handleCategoryFilter = (selectedCategory: string | null) => {
        selectedCategory ? setFilterOptions(prevState => (
            {...prevState, cat: selectedCategory}
        )) : setFilterOptions(prevState => { 
            const {cat, ...rest} = prevState;
            return rest;
        });
    }

    const handlePriceFilter = (selectedPriceRange: {min: string, max: string | null} | null) => {
        const min = selectedPriceRange?.min;
        const max = selectedPriceRange?.max;
        // const maxFormat = max ? `-£${max}` : '+';
        // const message = selectedPriceRange ? `£${min}${maxFormat}` : null; 
        // console.log("Selected: "+message);
        min ? setFilterOptions(prevState => ( 
                { ...prevState, min: Number(selectedPriceRange!.min), max: (max ? Number(selectedPriceRange!.max) : null) } 
        )) : setFilterOptions(prevState => {
            const {min, max, ...rest} = prevState;
            return rest;
        });
    }

    const handleSortProducts = (selectedSort: string) => {
        setFilterOptions(prevState => (
            {...prevState, sortBy: selectedSort}
        ));
    }

    const fetchFilteredProducts = async () => {
        try {
            setIsFetching(true);
            setError(null);
            const query = new URLSearchParams();
            Object.entries(filterOptions).forEach(([key, value]) => {
                if (!value !== undefined && !value !== null) {
                    if (!(key === 'max' && value === null)) query.append(key, String(value));
                };
            })
            console.log(query.toString());
            const response = await fetch(`http://localhost:8080/api/products?${query}`);
            const resData = await response.json();
            setProducts(resData);
        } catch (error) {
            if (error instanceof Error) setError(error);
            else setError(new Error('An unknown error occurred'));
        } finally {
            setIsFetching(false);
        }
    }

    const fetchAllProducts = async () => {
        try {
            setIsFetching(true);
            setError(null);
            const response = await fetch('http://localhost:8080/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
            setCategories(getUniqueCategories(data));
        } catch (error) {
            if (error instanceof Error) setError(error);
            else setError(new Error('An unknown error occurred'));
        } finally {
            setIsFetching(false);
        }
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
            <SortSelect
                onChange={handleSortProducts}
            />
            {!fetching && error && <p>Error: {error.message}</p>}
            {!fetching && !error && products.length === 0 && <p>No products match your filter criteria</p>}
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

export default ProductsPage;