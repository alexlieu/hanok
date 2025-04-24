import MouseFollowingTooltip from "../ui/MouseFollowingTooltip";

type ProductImageProps = {
  image?: string;
};

const ProductImage: React.FC<ProductImageProps> = ({ image }) => (
  <div className="flex justify-center">
    <div className="bg-amber-200 w-4/5 h-full aspect-square">
      <MouseFollowingTooltip
        content={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="57"
            height="50"
            viewBox="0 -50 112 100"
            fill="gray"
          >
            <path
              d="M0-5H90L55-40 62-47 109 0 62 47 55 40 90 5H0z"
              stroke="gray"
              strokeWidth={5}
            />
          </svg>
        }
        tooltipClass="bg-[transparent]"
        arrowHeight={-25}
      >
        <div className="w-full h-full">
          {image && (
            <img
              src={image}
              alt="Product"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </MouseFollowingTooltip>
    </div>
  </div>
);

export default ProductImage;
