import { LoaderFunctionArgs } from "react-router-dom";
import { LoaderData } from "../types/ProductListView";
import { ProductView } from "../types/ProductListView";
import { productInfo } from "../types/ProductDetailView";

export const productsLoader = async(): Promise<LoaderData> => {
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


export const productLoader = async({params}: LoaderFunctionArgs<'productSlug'>): Promise<productInfo> => {
    try { 
        const slug = params.productSlug;
        const response = await fetch(
            `http://localhost:8080/api/products/by-slug/${slug}`
        );
        if (!response.ok) {
            throw new Response(JSON.stringify({message: 'Product not found.'}),{
                status: 404,
            });
        }
        return await response.json();
    } catch (error) {
        throw new Response(JSON.stringify({message: 'Failed to load product.'}),{
            status: 500,
        });
    }
}