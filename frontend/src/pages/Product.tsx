import { useLoaderData } from "react-router-dom";
import { productInfo } from "../types/ProductDetailView";
import { formatPrice } from "../utils/format";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductHeader from "../components/product/ProductHeader";
import OptionSelector from "../components/product/OptionSelector";
import QuantitySelector from "../components/product/QuantitySelector";
import AddToBasketButton from "../components/product/AddToBasketButton";
import ProductImage from "../components/product/ProductImage";
import useProductVariationDetails from "../utils/hooks/features/product/useProductVariationDetails";
import useOrderSelection from "../utils/hooks/features/product/useOrderSelection";
import useAddToBasket from "../utils/hooks/useAddToBasket";

const ProductPage: React.FC = () => {
  const info = useLoaderData<productInfo>();
  const { sizes, flavours, getPrice } = useProductVariationDetails(
    info.variations
  );
  const { price, selectedOptions, handleOptionSelect } =
    useOrderSelection(getPrice);

  const { addToBasket, handleAddToBasket } = useAddToBasket(
    selectedOptions,
    info.variations
  );

  return (
    <>
      <ProductBreadcrumb category={info.category} />
      <div className="grid grid-cols-2">
        <ProductImage image={info.imageUrl} />
        <div className={`grid grid-rows-7`}>
          <div>
            <ProductHeader name={info.name} description={info.description} />
          </div>
          <div>
            <OptionSelector
              type="size"
              options={sizes}
              selected={selectedOptions.size}
              onSelect={handleOptionSelect("size")}
            />
          </div>
          <div>
            <OptionSelector
              type="flavour"
              options={flavours}
              selected={selectedOptions.flavour}
              onSelect={handleOptionSelect("flavour")}
            />
          </div>
          <div>
            <QuantitySelector
              max={10}
              selected={selectedOptions.quantity}
              onSelect={handleOptionSelect("quantity")}
            />
          </div>
          <div>
            <AddToBasketButton onClick={handleAddToBasket} />
          </div>
          {price !== null && price !== undefined && (
            <p className="text-xl">{formatPrice(price)}</p>
          )}
          {addToBasket && <p>{`${addToBasket.id}*${addToBasket.quantity}`}</p>}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
