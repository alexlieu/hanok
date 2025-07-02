import React from "react";

type AccordianItemProps = {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
};

type AccordianRadioItemProps = {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  radioName: string;
  radioValue: string;
  isChecked: boolean;
};

export const AccordianItem: React.FC<AccordianItemProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="overflow-hidden transition-all duration-500 ease-in-out">
      <button
        className="text-xl cursor-pointer font-medium tracking-wide"
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {title}
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-600 ease-[cubic-bezier(0.65, 0, 0.35, 1)] ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`p-4 border-t-2 border-gray-200`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export const AccordianRadioItem: React.FC<AccordianRadioItemProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
  radioName,
  radioValue,
  isChecked,
}) => {
  return (
    // Not sure what the styling here does.
    <div className={`overflow-hidden transition-all duration-500 ease-in-out`}>
      <button
        className="text-xl cursor-pointer"
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 px-7">
          <input
            type="radio"
            id={`${radioValue}-${radioName}`}
            name={radioName}
            value={radioValue}
            checked={isChecked}
            onChange={onToggle}
            className="peer hidden"
            aria-label={`Select ${title} payment method.`}
          />
          <label
            htmlFor={`${radioValue}-${radioName}`}
            className={`
                relative flex items-center justify-center w-[1rem] h-[1rem] rounded-full border-1 cursor-pointer
                transition-all duration-300 ease-in-out
                peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2
                ${
                  isChecked
                    ? "bg-stone-500 border-stone-500"
                    : "bg-transparent border-stone-400"
                }
                `}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`
                w-full h-full rounded-full absolute transition-transform duration-300 ease-in-out
                ${
                  isChecked ? "scale-[0.4] bg-white" : "scale-90 bg-transparent"
                }
                `}
            ></div>
          </label>
          <span>{title}</span>
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-600 ease-[cubic-bezier(0.65, 0, 0.35, 1)] ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`px-7 pt-3 border-t-2 border-gray-200`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
