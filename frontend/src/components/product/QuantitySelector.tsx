type QuantitySelectorProps = {
  max: number;
  selected: number;
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  max,
  selected,
  onSelect,
}) => (
  <>
    <h4 className={`text-xl font-medium`}>quantity</h4>
    {Array.from({ length: max }, (_, i) => i + 1).map((q) => (
      <button
        type="button"
        key={`quantity-${q}`}
        className={`text-2xl px-4 py-2 transition-all font-medium
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
  </>
);

export default QuantitySelector;
