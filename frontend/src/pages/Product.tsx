import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { productInfo, variant } from "../types/ProductDetailView";
import { formatPrice } from "../utils/format";

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
            (value) && setSelectedOptions(prevState => ({...prevState, [optionTarget]: value}));
        };

    const handleAddToBasket = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAddToBasket({id: info.variations.find(v=>v.flavour===selectedOptions.flavour && v.size===selectedOptions.size)!.id, quantity: selectedOptions.quantity});
    }

    return (
        <>
            <Link to={``}>{info.category}</Link>
            <div className="grid grid-cols-2">
                <div className="flex justify-center">
                    <div className="bg-amber-200 w-4/5 h-full aspect-square"></div>
                </div>
                <div>
                    <h1 className={`text-3xl font-semibold`}>{(info.name).toLowerCase()}</h1>
                    <p className={`text-[1.2em]`}>{info.description}</p>
                    <h4 className={`text-xl font-medium`}>Size</h4>
                    {sizes.map(size => (
                        <button
                            type='button'
                            key={`size-${size}`}
                            className={`text-2xl px-4 py-2 transition-all font-medium
                                ${
                                    selectedOptions.size === size
                                        ? 'text-black'
                                        : 'hover:text-black text-gray-400'
                                }
                            `}
                            onClick={handleOptionSelect('size')}
                            data-size={size}
                        >
                                {size.toLowerCase()}
                        </button>
                    ))}
                    <h4 className={`text-xl font-medium`}>Flavours</h4>
                    {flavours.map(flavour => (
                        <button
                            type='button'
                            key={`flavour-${flavour}`}
                            className={`text-2xl px-4 py-2 transition-all font-medium
                                ${
                                    selectedOptions.flavour === flavour
                                        ? 'text-black'
                                        : 'hover:text-black text-gray-400'
                                }
                            `}
                            onClick={handleOptionSelect('flavour')}
                            data-flavour={flavour}
                        >
                            {flavour.toLowerCase()}
                        </button>
                    ))} 
                    <h4 className={`text-xl font-medium`}>Quantity</h4>
                    {Array.from({length: 10}, (_, i) => i + 1).map((q) => (
                        <button
                            type='button'
                            key={`quantity-${q}`}
                            className={`text-2xl px-4 py-2 transition-all font-medium
                                ${
                                    selectedOptions.quantity == q
                                        ? 'text-black'
                                        : 'hover:text-black text-gray-400'
                                }
                            `}
                            onClick={handleOptionSelect('quantity')}
                            data-quantity={q}
                        >
                            {q}
                        </button>
                    ))}
                    <button
                        type='button'
                        className={`text-2xl font-medium px-4 py-2 border-black border-1 transition-colors hover:text-white hover:bg-black`}
                        onClick={handleAddToBasket}
                    >
                        add to basket
                    </button>
                    {(price) && <p className="text-xl">{formatPrice(price)}</p>}
                    {(addToBasket) && <p>{`${addToBasket.id}*${addToBasket.quantity}`}</p>}
                </div>
            </div>
        </>
    )
}

export default ProductPage;

export const loader = async({params}: LoaderFunctionArgs<'product-slug'>): Promise<productInfo> => {
    try { 
        const slug = params['product-slug'];
        const productIdResponse = await fetch(
            `http://localhost:8080/api/products/slug/${slug}`
        );
        if (!productIdResponse.ok) {
            throw new Response(JSON.stringify({message: 'Product not found.'}),{
                status: 404,
            });
        }
        const id = await productIdResponse.json();

        const productDetailResponse = await fetch(
            `http://localhost:8080/api/products/${id}`
        );
        if (!productDetailResponse.ok) {
            throw new Response(JSON.stringify({message: 'Could not fetch product details.'}),{
                status: productDetailResponse.status,
            });
        }
        return await productDetailResponse.json();
    } catch (error) {
        throw new Response(JSON.stringify({message: 'Failed to load product.'}),{
            status: 500,
        });
    }
}