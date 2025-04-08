import { useRouteLoaderData, Link } from "react-router-dom";
import { LoaderData } from "../../types/ProductListView";
import { getCategoryPath } from "../../utils/route";

const CategoryList: React.FC = () => {
    const {categoryCounts} = useRouteLoaderData('all-products') as LoaderData;
    return (
        <div className={`flex justify-center`}>
            <ul className={`flex gap-10`}>
                {categoryCounts?.map(({category, displayName, count}) => (
                    (count != 0) && 
                    <Link 
                        key={(category) ? category : 'ALL'} 
                        to={(category) ? 
                                (getCategoryPath(displayName)) :
                                ('/products')    
                            }
                    >
                        <li className={``}>
                            <div className={`text-[1.1em]`}>
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