export const formatPrice = (value: number) => {
    if (value % 1 != 0) return ((value % 1).toString.length === 3) ? `£${value}0` : `£${value}`;
    return `£${value}.00`;
};

export const formatProductNameToSlug = (name: string) => {
    return Array.from(name.toLowerCase().split(' ')).join('-');
}