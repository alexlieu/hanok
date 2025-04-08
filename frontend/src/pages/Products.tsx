import { LoaderFunctionArgs } from "react-router-dom";
import CategoryList from "../components/CategoryList";
import ProductsList from "../components/ProductsList";
import { LoaderData, ProductView } from "../types/ProductListView";

const ProductsPage: React.FC = () => {
    return(
        <>
            <CategoryList />
            <ProductsList />
        </>
    );
}

export default ProductsPage;

export const loader = async(): Promise<LoaderData> => {
    try {
        const [allProducts, categoryCounts] = await Promise.all([
            fetch('http://localhost:8080/api/products')
                .then(res => res.ok ? res.json() : null)
                .catch(() => null),
            fetch('http://localhost:8080/api/products/categories')
                .then(res => res.ok ? res.json() : null)
                .catch(() => null),
        ]);
        if (!allProducts || !categoryCounts) {
            throw new Response(JSON.stringify({message: 'Partial data failure.'}), {
                status: 500
            });
        }
        return {allProducts, categoryCounts};
    } catch (error) {
        throw new Response(JSON.stringify({message: 'Failed to fetch products.'}),{
            status: 500,
        })
    }
    // const response = await fetch('http://localhost:8080/api/products');
    // if (!response.ok) throw new Response(JSON.stringify({message: 'Could not retrieve products.'}),{
    //     status: response.status,
    // })
    // const responseData = await response.json();
    // return responseData;
}

export const productsByCategoryLoader = async({params}: LoaderFunctionArgs<'categorySlug'>): Promise<ProductView[]> => {
    const categorySlug = params.categorySlug;
    const response = await fetch(
        `http://localhost:8080/api/products?category=${categorySlug}`
    );
    if (!response.ok) throw new Response(JSON.stringify({message: `Failed to fetch products.`}), {
        status: 500,
    });
    return await response.json();
}