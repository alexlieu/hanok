import { useState } from "react";
import Flower4SVGComponent from "../../assets/SVG/Flower4SVGComponent";

interface SortProps {
    searchParams: string | null;
    onChange: (selectionOption: string) => void;
}

const sortParams = [
    {val: 'name', display: 'A-Z'},
    {val: 'cat', display: 'Category'},
    {val: 'price', display: 'Price'},
];

const SortSelect: React.FC<SortProps> = ({searchParams, onChange}) => {

    const startVal = searchParams ?? 'name';
    const [sortParam, setSortParam] = useState<string>(startVal);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selection = event.target.value;
        setSortParam(prevState => (prevState !== selection ? selection : prevState));
        onChange(selection);
    }

    return (
        <div className="grid relative w-fit">
            <select 
                value={sortParam} 
                onChange={handleSortChange} 
                className={`appearance-none pr-8 cursor-pointer focus:outline-none col-start-1 row-start-1 w-fit text-center`}>

                {sortParams.map(params => (
                    <option key={params.val} value={params.val}>{params.display}</option>
                ))}
            </select>
            <Flower4SVGComponent className={`pointer-events-none col-start-1 row-start-1 absolute right-1 fill-current w-6 h-6`} />
        </div>
    )
}

export default SortSelect;