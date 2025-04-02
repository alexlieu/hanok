import { useState } from "react";
import FlowerSVGComponent from "./FlowerSVGComponent";
import Flower2SVGComponent from "./Flower2SVGComponent";
import Flower3SVGComponent from "./Flower3SVGComponent";
import Flower4SVGComponent from "./Flower4SVGComponent";

interface SortProps {
    onChange: (selectionOption: string) => void;
}

const sortParams = [
    {val: 'name', display: 'Alphabetical'},
    {val: 'cat', display: 'Category'},
    {val: 'price', display: 'Price'},
];

const SortSelect: React.FC<SortProps> = ({onChange}) => {

    const [sortParam, setSortParam] = useState<string>('feat');

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selection = event.target.value;
        setSortParam(prevState => (prevState !== selection ? selection : prevState));
        onChange(selection);
    }

    return (
        <div className="flex">
            <select value={sortParam} onChange={handleSortChange} className="appearance-none">
                {sortParams.map(params => (
                    <option value={params.val}>{params.display}</option>
                ))}
            </select>
            <FlowerSVGComponent />
            <Flower2SVGComponent />
            <Flower3SVGComponent />
            <Flower4SVGComponent />
        </div>
    )
}

export default SortSelect;