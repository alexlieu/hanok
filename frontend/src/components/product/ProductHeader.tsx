type ProductHeaderProps = {
    name: string;
    description?: string;
};

const ProductHeader: React.FC<ProductHeaderProps> = ({name, description}) => (
    <>
        <h1 className={`text-3xl font-semibold`}>{name.toLowerCase()}</h1>
        <p className={`text-[1.2em]`}>{description}</p>
    </>
);

export default ProductHeader;