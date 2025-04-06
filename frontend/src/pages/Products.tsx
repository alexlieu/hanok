import { useState, useEffect } from "react";
import ErrorType from "../types/ErrorType";
import { ProductView } from "../types/ProductListView";
import CategoryFilter from "../components/CategoryFilter";
import PriceFilter from "../components/PriceFilter";
import SortSelect from "../components/SortSelect";
import { useLoaderData, Link, useSearchParams } from "react-router-dom";

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
    if (value % 1 != 0) return ((value % 1).toString().length === 3) ? `£${value}0` : `£${value}`; 
    return `£${value}.00`; 
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

const validFilter = {
    cat: 'cat', 
    min: 'min',
    max: 'max',
    available: 'available',
    sortBy: 'sortBy',
    sortDir: 'sortDir'
} as const;

const validSortBy = {
    price: 'price',
    cat: 'cat',
    name: 'name'
} as const;

const validSortDir = {
    desc: 'desc',
    asc: 'asc'
} as const;

type FilterOption = keyof typeof validFilter;
type SortByOption = keyof typeof validSortBy;
type SortDirOption = keyof typeof validSortDir;

interface ProductFilters {
    [validFilter.cat]?: string;
    [validFilter.min]?: number;
    [validFilter.max]?: number | null;
    [validFilter.available]?: boolean;
    [validFilter.sortBy]?: string;
    [validFilter.sortDir]?: string;
}

const setFilterOptionsViaSearchParams = (searchParams: URLSearchParams, categoriesWithCount: {category: string, count: number}[]):Partial<ProductFilters> => {
    const validCategories = categoriesWithCount.map(c => c.category);
    const filterOptions: Partial<ProductFilters> = {};

    Array.from(searchParams.entries()).forEach(([key, value]) => {
        if (!isValidFilterKey(key)) {
            console.warn(`Invalid filter key: ${key}`);
            return;
        } 

        switch (key) {
            case validFilter.cat:
                if (validCategories.includes(value)) {
                    filterOptions.cat = value;
                }
                break;

            // case validFilter.min:
            // case validFilter.max:
            //     const numericValue = Number(value);
            //     (!isNaN(numericValue)) && (filterOptions[key] = numericValue);
            //     break;
            
            case validFilter.sortBy:
                if (isValidSortBy(value)) {
                    filterOptions[key] = value as SortByOption;
                }
                break;

            case validFilter.sortDir:
                if (isValidSortDir(value)) {
                    filterOptions[key] = value as SortDirOption;
                }
                break;
        }
    });
    return filterOptions;
};

const isValidFilterKey = (key: string): key is FilterOption => {
    return Object.keys(validFilter).includes(key);
};
const isValidSortBy = (value: string): value is SortByOption => {
    return Object.keys(validSortBy).includes(value);
};
const isValidSortDir = (value: string): value is SortDirOption => {
    return Object.keys(validSortDir).includes(value);
};

const ProductsPage: React.FC = () => {
    const preloadProducts = useLoaderData<ProductView[]>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [fetching, setIsFetching] = useState(false);
    const [categories, setCategories] = useState<{category: string, count: number}[]>(getUniqueCategories(preloadProducts));
    const [error, setError] = useState<ErrorType>(null);
    const [filterOptions, setFilterOptions] = useState<ProductFilters>(setFilterOptionsViaSearchParams(searchParams, categories));
    const [products, setProducts] = useState<ProductView[]>(preloadProducts);

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
                    if (!(key === validFilter.max && value === null)) query.append(key, String(value));
                };
            })
            const response = await fetch(`http://localhost:8080/api/products?${query}`);
            const resData = await response.json();
            setSearchParams(query);
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
            setSearchParams({});
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
                searchParam={filterOptions[validFilter.cat] ?? null}
                onChange = {handleCategoryFilter}
            />
            <PriceFilter 
                onChange={handlePriceFilter}
            />
            <SortSelect
                searchParams={filterOptions[validFilter.sortBy] ?? null}
                onChange={handleSortProducts}
            />
            {!fetching && error && <p>Error: {error.message}</p>}
            {!fetching && !error && products.length === 0 && <p>No products match your filter criteria</p>}
            {products.length > 0 && (
                <ul className="grid grid-cols-3 gap-4">
                    {products.map((product) => (
                        <Link to={`${product.id}`} key={`${product.id}`}>
                            <li className="flex justify-evenly">
                                <h3>{product.name}</h3>
                                <p>{formatPrice(product.price)}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </>
    );
}

export default ProductsPage;