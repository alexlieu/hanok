type ProductImageProps = {
    image?: string;
};

const ProductImage: React.FC<ProductImageProps> = ({image}) => (
    <div className="flex justify-center">
        <div className="bg-amber-200 w-4/5 h-full aspect-square">
            {image && <img src={image} alt="Product" className="w-full h-full object-cover" />}
        </div>
    </div> 
);

export default ProductImage;