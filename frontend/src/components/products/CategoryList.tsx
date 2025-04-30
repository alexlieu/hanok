import CategoryContent from "./CategoryContent";

type CategoryListProps = {
  containerClass?: string;
};

const CategoryList: React.FC<CategoryListProps> = ({ containerClass }) => (
  <div className={`flex justify-center ${containerClass}`}>
    <CategoryContent />
  </div>
);

export default CategoryList;
