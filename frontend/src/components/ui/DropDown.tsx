import { useEffect, useRef, useState } from "react";

type DropDownProps = {
    options: string[];
};
const DropDown: React.FC<DropDownProps> = ({ options }) => { 
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div>
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                Sort by: {selectedOption}
            </button>
            {isOpen && (
                <ul
                ref={dropdownRef}
                role="listbox"
                tabIndex={-1}
                aria-activedescendant={selectedOption}
                className={`absolute`}
                >
                    {options.map(option => (
                        <li
                        key={option} 
                        role="option"
                        tabIndex={0}
                        aria-selected={option === selectedOption}
                        onClick={() => {
                            setSelectedOption(option);
                            setIsOpen(false);
                        }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
 };

export default DropDown;