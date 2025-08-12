type QuantitySelectorProps = {
  max: number;
  selected: number;
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  max,
  selected,
  onSelect,
  className,
}) => (
  <div className={`${className}`}>
    <h4 className={`text-3xl font-dongle uppercase`}>quantity</h4>
    <div className="flex flex-row justify-around max-w-[500px]">
      {Array.from({ length: max }, (_, i) => i + 1).map((q) => (
        <button
          type="button"
          key={`quantity-${q}`}
          className={`text-5xl font-dongle transition-all font-medium 
                    ${
                      selected == q
                        ? "text-black"
                        : "hover:text-black text-gray-400"
                    }
                `}
          onClick={onSelect}
          data-quantity={q}
        >
          {q}
        </button>
      ))}
    </div>
  </div>
);

export default QuantitySelector;
