import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { easeInOutExpo } from "../../utils/ease";

type DropDownProps = {
  options: string[];
  handleSelect: (option: string) => void;
  currentSort: string;
};
const DropDown: React.FC<DropDownProps> = ({
  options,
  handleSelect,
  currentSort,
}) => {
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`text-[1em] min-w-50 w-auto text-right`}
      >
        Sort
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="absolute -left-[16px] w-[calc(100%+32px)] pr-[16px] overflow-hidden">
            <motion.ul
              ref={dropdownRef}
              role="listbox"
              tabIndex={-1}
              aria-activedescendant={selectedOption}
              className={`flex flex-col gap-2 py-2 bg-white`}
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ ease: easeInOutExpo }}
            >
              {options.map((option) => (
                <li
                  key={option}
                  role="option"
                  tabIndex={0}
                  aria-selected={option === selectedOption}
                  onClick={() => {
                    setSelectedOption(option);
                    setIsOpen(false);
                    handleSelect(option);
                  }}
                  className={`text-[.7em] text-right ${
                    currentSort === option && `text-blue-600 opacity-80`
                  }`}
                >
                  {option}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropDown;
