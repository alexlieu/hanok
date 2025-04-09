import { useRouteLoaderData, useParams, Link } from "react-router-dom";
import { LoaderData } from "../../types/ProductListView";
import { getCategoryPath } from "../../utils/route";
import { formatNameToSlug } from "../../utils/format";
import { getRandomBGColour } from "../../utils/fun";

const checkActiveCategory = (routeParam: string | undefined, target: string) => {
    if (!routeParam && target === 'All') return true;
    return routeParam ? formatNameToSlug(target)  === routeParam : false;
};

const CategoryList: React.FC = () => {
    const {categoryCounts} = useRouteLoaderData('all-products') as LoaderData;
    const {categorySlug} = useParams();
    
    return (
        <div className={`flex justify-center`}>
            <ul className={`flex gap-10`}>
                {categoryCounts?.map(({category, displayName, count}) => (
                    (count != 0) && 
                    <Link 
                        key={(category) ? category : 'ALL'} 
                        to={checkActiveCategory(categorySlug, displayName) || !category 
                                ? '/products'
                                : getCategoryPath(displayName)
                            }
                    >
                        <li className={``}>
                            <div className={`
                                ${checkActiveCategory(categorySlug, displayName) && `${getRandomBGColour()} transition-colors`} text-[1.1em] pl-2 pr-2 
                            `}>
                                {`${displayName}`}
                                <span className={`pl-1`}>{`(${count})`}</span>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}
export default CategoryList;