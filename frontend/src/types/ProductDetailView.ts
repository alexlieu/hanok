export type variant = {
    id: number;
    price: number;
    available: true;
    flavour: string;
    size: string;
    active: boolean;
};

export type productInfo = {
    id: number;
    name: string;
    description?: string;
    category: string;
    basePrice: number;
    imageUrl?: string;
    active: boolean;
    variations: variant[];
};