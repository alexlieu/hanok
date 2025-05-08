import MouseFollowingTooltip from "../ui/MouseFollowingTooltip";

type ProductImageProps = {
  className?: string;
  image?: string;
};

const ProductImage: React.FC<ProductImageProps> = ({ className, image }) => (
  <div className={`flex justify-center ${className}`}>
    <div className="bg-amber-500 aspect-square w-full object-cover">
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
