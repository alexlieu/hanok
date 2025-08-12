type OptionSelectorProps = {
  type: "size" | "flavour";
  options: string[];
  selected: string | null;
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

const OptionSelector: React.FC<OptionSelectorProps> = ({
  type,
  options,
  selected,
  onSelect,
  className,
}) => (
  <div className={className}>
    <h4 className={`text-3xl font-dongle uppercase`}>{type}</h4>
    <div className="flex justify-between w-fit gap-4">
      {options.map((option) => (
        <button
          type="button"
          key={`${type}-${option}`}
          className={`text-2xl transition-all font-medium
                    ${
                      selected === option
                        ? "text-black"
                        : "hover:text-black text-gray-400"
                    }
                `}
          onClick={onSelect}
          {...{
            [`data-${type}`]: option,
          }}
        >
          {option.toLowerCase()}
        </button>
      ))}
    </div>
  </div>
);

export default OptionSelector;
