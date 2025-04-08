import { useEffect, useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { productInfo, variant } from "../types/ProductDetailView";
import { formatPrice } from "../utils/format";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductHeader from "../components/product/ProductHeader";
import OptionSelector from "../components/product/OptionSelector";
import QuantitySelector from "../components/product/QuantitySelector";
import AddToBasketButton from "../components/product/AddToBasketButton";
import ProductImage from "../components/product/ProductImage";

const getOptionData = (variations: variant[]) => {
    const sizes = new Set<string>();
    const flavours = new Set<string>();
    const priceMap: Record<string, number> = {};

    variations.forEach(v => {
        sizes.add(v.size);
        flavours.add(v.flavour);
        const key = `${v.size}|${v.flavour}`;
        priceMap[key] = v.price;
    })

    return {
        sizes: [...sizes],
        flavours: [...flavours],
        getPrice: (size: string, flavour: string) => {
            const key = `${size}|${flavour}`;
            return priceMap[key] ?? null;
        }
    }
};

const ProductPage:React.FC = () => {
    const info = useLoaderData<productInfo>();
    const {sizes, flavours, getPrice} = getOptionData(info.variations);
    const [selectedOptions, setSelectedOptions] = useState<{size: string, flavour: string, quantity: number}>({size: 'REGULAR', flavour: 'PLAIN', quantity: 1});
    const [price, setPrice] = useState<number | undefined>();
    const [addToBasket, setAddToBasket] = useState<{id: number, quantity: number}>()
    
    useEffect(()=>{
        (selectedOptions.flavour && selectedOptions.size && selectedOptions.quantity) && setPrice(getPrice(selectedOptions.size, selectedOptions.flavour)*selectedOptions.quantity);
    }, [selectedOptions]);
    
    const handleOptionSelect = (optionTarget: 'size' | 'flavour' | 'quantity') => 
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            const value = event.currentTarget.dataset[optionTarget];
            setSelectedOptions(prevState => ({...prevState, [optionTarget]: value}));
        };

    const handleAddToBasket = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAddToBasket({id: info.variations.find(v=>v.flavour===selectedOptions.flavour && v.size===selectedOptions.size)!.id, quantity: selectedOptions.quantity});
    }

    return (
        <>
            <ProductBreadcrumb category={info.category}/>
            <div className="grid grid-cols-2">
                <ProductImage
                    image={info.imageUrl}
                />
                <div>
                    <ProductHeader name={info.name} description={info.description} />
                    <OptionSelector
                        type="size" 
                        options={sizes} 
                        selected={selectedOptions.size} 
                        onSelect={handleOptionSelect('size')}
                    />
                    <OptionSelector
                        type="flavour" 
                        options={flavours} 
                        selected={selectedOptions.flavour} 
                        onSelect={handleOptionSelect('flavour')}
                    />
                    <QuantitySelector
                        max = {10} 
                        selected={selectedOptions.quantity}
                        onSelect={handleOptionSelect('quantity')}
                    />
                    <AddToBasketButton
                        onClick={handleAddToBasket}
                    />
                    {(price) && <p className="text-xl">{formatPrice(price)}</p>}
                    {(addToBasket) && <p>{`${addToBasket.id}*${addToBasket.quantity}`}</p>}
                </div>
            </div>
        </>
    )
}

export default ProductPage;

export const loader = async({params}: LoaderFunctionArgs<'productSlug'>): Promise<productInfo> => {
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