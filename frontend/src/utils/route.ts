import { ProductView } from "../types/ProductListView";
import { formatNameToSlug } from "./format";

export const getProductPath = (product: ProductView) => {
    return `/products/${formatNameToSlug(product.category)}/${formatNameToSlug(product.name)}`;
};
 
export const getCategoryPath = (category: string) => {
    return `/products/${formatNameToSlug(category)}`;
};