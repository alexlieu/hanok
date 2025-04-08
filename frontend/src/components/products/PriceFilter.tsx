import { useState } from "react";

interface FilterProps {
    onChange: (selectionOption: {min: string, max: string | null} | null) => void;
}

const priceRanges = [{min: '0', max: '10'}, {min: '10', max: '15'}, {min: '15', max: '20'}, {min: '20', max: null}];

const PriceFilter: React.FC<FilterProps> = ({onChange}) => {

    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleFilterChange = (optionId: string, option: {min: string, max: string | null}) => {
        const newSelection = selectedOption === optionId ? null : optionId;
        setSelectedOption(newSelection);
        onChange(newSelection ? option : null);
    }

    return (
        <>
            <ul>
                <li>
                    {priceRanges.map(range => (
                        <label key={`£${range.min}`}>
                            <input
                                type="checkbox"
                                checked={selectedOption === range.min}
                                onChange={() => handleFilterChange(range.min, {min: range.min, max: range.max})}
                            />
                            <span>{(range.max) ? `£${range.min}-£${range.max}` : `£${range.min}+`}</span>
                        </label>
                    ))}
                </li>
            </ul>
        </>
    )
}

export default PriceFilter;