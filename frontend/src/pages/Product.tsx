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

const divideStyle = "border-t-2 pt-1";

const ProductPage: React.FC = () => {
  const info = useLoaderData<productInfo>();
  const { sizes, flavours, getPrice } = useProductVariationDetails(
    info.variations
  );
  const { price, selectedOptions, handleOptionSelect } =
    useOrderSelection(getPrice);

  const { handleAddToBasket } = useAddToBasket(
    selectedOptions,
    info.name,
    info.variations
  );

  return (
    <div className="flex flex-col m-auto md:flex-row max-w-7xl">
      <div className="pt-5 md:w-[50vw]">
        <ProductBreadcrumb
          product={info.name}
          category={info.category}
          className="pl-10 pb-3 md:pl-0 font-semibold uppercase flex flex-row"
        />
        <ProductImage className="mx-10" image={info.imageUrl} />
      </div>
      <div className="mx-5 p-5 md:pt-5 md:w-[50vw] md:mt-10">
        <ProductHeader
          name={info.name}
          which={"title"}
          titleClass="text-4xl font-semibold"
        />
        {price !== null && price !== undefined && (
          <p className="text-4xl w-fit pt-1">{formatPrice(price)}</p>
        )}
        <div className="space-y-2 mt-5">
          <OptionSelector
            type="flavour"
            options={flavours}
            selected={selectedOptions.flavour}
            onSelect={handleOptionSelect("flavour")}
            className={`${divideStyle}`}
          />
          <OptionSelector
            type="size"
            options={sizes}
            selected={selectedOptions.size}
            onSelect={handleOptionSelect("size")}
            className={`${divideStyle}`}
          />
          <QuantitySelector
            max={10}
            selected={selectedOptions.quantity}
            onSelect={handleOptionSelect("quantity")}
            className={`${divideStyle}`}
          />
        </div>

        <AddToBasketButton
          onClick={handleAddToBasket}
          selection={selectedOptions}
          product={info.name}
        />
        <ProductHeader
          name={info.name}
          description={info.description}
          which={"description"}
          descriptionClass={`text-[1.2em]`}
        />
      </div>
      {/* <div className="flex flex-col md:flex-row">
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
            <AddToBasketButton
              onClick={handleAddToBasket}
              selection={selectedOptions}
              product={info.name}
            />
          </div>
          {price !== null && price !== undefined && (
            <p className="text-xl">{formatPrice(price)}</p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default ProductPage;
