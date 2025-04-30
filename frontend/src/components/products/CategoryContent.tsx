import { useRouteLoaderData, useParams, Link } from "react-router-dom";
import { formatNameToSlug } from "../../utils/format";
import { LoaderData } from "../../types/ProductListView";
import { getCategoryPath } from "../../utils/route";
import { getStableBGColor } from "../../utils/fun";

type CategoryContentProps = {
  listClass?: string;
  closeDropdown?: () => void;
};

const checkActiveCategory = (
  routeParam: string | undefined,
  target: string
) => {
  if (!routeParam && target === "All") return true;
  return routeParam ? formatNameToSlug(target) === routeParam : false;
};

const CategoryContent: React.FC<CategoryContentProps> = ({
  listClass = "flex flex-row gap-8",
  closeDropdown,
}) => {
  const { categoryCounts } = useRouteLoaderData("all-products") as LoaderData;
  const { categorySlug } = useParams();
  return (
    <ul className={`${listClass}`}>
      {categoryCounts?.map(
        ({ category, displayName, count }, index) =>
          count != 0 && (
            <Link
              key={category ? category : "ALL"}
              to={
                checkActiveCategory(categorySlug, displayName) || !category
                  ? "/products"
                  : getCategoryPath(displayName)
              }
              onClick={() => closeDropdown?.()}
              className="w-fit"
            >
              <li className={``}>
                <div
                  className={`
                                ${
                                  checkActiveCategory(
                                    categorySlug,
                                    displayName
                                  ) &&
                                  `${getStableBGColor(index)} transition-colors`
                                } text-[1em]
                            `}
                >
                  {`${displayName}`}
                  <span className={`pl-1`}>{`(${count})`}</span>
                </div>
              </li>
            </Link>
          )
      )}
    </ul>
  );
};

export default CategoryContent;
