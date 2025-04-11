export type ProductView = {
    id: number;
    name: string;
    category: string;
    imageUrl?: string;
    priceRange: {min: number, max: number};
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