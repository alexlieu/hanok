export type ProductView = {
    id: number;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
};

export type ProductsView = {
    products: {
        results: ProductView;
    }
};