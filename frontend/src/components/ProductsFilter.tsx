import { useState } from "react"

interface FilterProps {
    options: string[];
    onChange: (selectionOption: string | null) => void;
}

const ProductsFilter: React.FC< FilterProps > = ({ options, onChange }) => {

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    
    const handleFilterChange = (optionId: string) => {
        const newSelection = selectedOption === optionId ? null : optionId;
        setSelectedOption(newSelection);
        onChange(newSelection);
    }

    return (
        <>
            <ul>
                <li>
                    {options.map(( cat, index ) => (
                        <label key={`${cat}-${index}`}>
                            <input 
                                type="checkbox"
                                checked={selectedOption === cat}
                                onChange={() => handleFilterChange(cat)}
                            />
                            <span>{cat}</span>
                        </label>
                    ))}
                </li>
            </ul>
        </>
    )
}

export default ProductsFilter