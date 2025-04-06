import { useState } from "react";

interface FilterProps {
    options: {category: string, count: number}[];
    searchParam: string | null;
    onChange: (selectionOption: string | null) => void;
}

const CategoryFilter: React.FC< FilterProps > = ({ options, searchParam, onChange }) => {

    const [selectedOption, setSelectedOption] = useState<string | null>(searchParam);
    
    const handleFilterChange = (optionId: string) => {
        const newSelection = selectedOption === optionId ? null : optionId;
        setSelectedOption(newSelection);
        onChange(newSelection);
    }

    return (
        <>
            <ul>
                <li>
                    {options.map(( { category, count } , index ) => (
                        <label key={`${category}-${index}`}>
                            <input 
                                type="checkbox"
                                checked={selectedOption === category}
                                onChange={() => handleFilterChange(category)}
                            />
                            <span>{`${category} (${count})`}</span>
                        </label>
                    ))}
                </li>
            </ul>
        </>
    )
}

export default CategoryFilter