export const formatPrice = (value: number): string => {
    const roundedValue = Math.round(value * 100) / 100;
    const formattedValue = roundedValue.toFixed(2);
    return `£${formattedValue}`;
};

export const formatNameToSlug = (name: string) => {
    return Array.from(name.toLowerCase().split(' ')).join('-');
}

export const formatPriceRange = (min: number, max: number) => {
    if (min === max)  return formatPrice(min); 
    return `${formatPrice(min)} - ${formatPrice(max)}`
}