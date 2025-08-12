import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { easeInOutExpo } from "../../utils/ease";
import CategoryContent from "./CategoryContent";

type CategoryDropdownProps = {
  containerClass?: string;
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  containerClass,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleFilterState = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={`${containerClass}`}>
        <button
          ref={triggerRef}
          className="outline-1 outline-cyan-200"
          onClick={handleFilterState}
        >
          <div className="flex flex-row place-content-center">
            <span className="text-[1em] ml-2">Filter</span>
            <svg
              width={12}
              height={10}
              viewBox="-6 -6 12 6"
              className="m-auto mx-2"
            >
              <path
                d="m6 0-6-4.8L-6 0"
                fill="none"
                stroke="black"
                strokeWidth={2}
                transform={!isOpen ? "rotate(180, 0 -3)" : "rotate(0)"}
              ></path>
            </svg>
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute w-screen -left-2 overflow-x-hidden z-10"
              style={{ scrollbarGutter: "stable" }}
            >
              <motion.div
                ref={dropdownRef}
                className="bg-white w-full h-full"
                initial={{ y: "-200px" }}
                animate={{ y: 0 }}
                exit={{ y: "-200px" }}
                transition={{
                  ease: easeInOutExpo,
                }}
              >
                <CategoryContent
                  listClass={`grid grid-cols-2 gap-2 py-5 px-4`}
                  closeDropdown={closeDropdown}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CategoryDropdown;
