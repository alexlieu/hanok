type ProductHeaderProps = {
  name: string;
  description?: string;
  which?: "title" | "description" | "both";
  titleClass?: string;
  descriptionClass?: string;
};

const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  description,
  which = "title",
  titleClass,
  descriptionClass,
}) => (
  <>
    {which === "title" ? (
      <h1 className={`${titleClass}`}>{name.toLowerCase()}</h1>
    ) : which === "description" ? (
      <>
        <h4 className="text-3xl font-dongle uppercase border-t-2 pt-1">
          description
        </h4>
        <p className={`${descriptionClass}`}>{description}</p>
      </>
    ) : (
      <>
        <h1 className={`${titleClass}`}>{name.toLowerCase()}</h1>
        <p className={`${descriptionClass}`}>{description}</p>
      </>
    )}
  </>
);

export default ProductHeader;
