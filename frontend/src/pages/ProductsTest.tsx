import { useLoaderData } from "react-router-dom";
import { ProductView } from "../types/ProductListView";

export const productsLoader = async (): Promise<ProductView[]> => {
    const response = await fetch('http://localhost:8080/api/products');
    if (!response.ok) throw new Error('Some error occured'); 
    const data = await response.json();
    return data;
};

const ProductsTest: React.FC = () => {
    const products = useLoaderData() as ProductView[];
    console.log(products);
    return(
        <>
            <ul>
                {products.map((product) => ( 
                    <li>{product.name}</li>
                 ))}
            </ul>
        </>
    )
}
export default ProductsTest;
