export type ProductView = {
    id: number;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
};

export type CategoryCount = {
    category: string;
    displayName: string;
    count: number;
};

export type LoaderData = {
    allProducts: ProductView[] | null;
    categoryCounts: CategoryCount[] | null;
}