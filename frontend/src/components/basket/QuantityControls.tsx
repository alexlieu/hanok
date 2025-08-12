import { useState, useEffect } from "react";
import {
  PlusSVGComponent,
  MinusSVGComponent,
} from "../../assets/SVG/QuantitySVGComponent";

type QuantityControlsProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
};

const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onQuantityChange,
  min = 1,
  max = 10,
}) => {
  const [inputValue, setInputValue] = useState(quantity.toString());
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (!isFocused) {
      setInputValue(quantity.toString());
    }
  }, [quantity, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === "") {
      setInputValue("");
      return;
    }

    if (/^\d*$/.test(rawValue)) {
      setInputValue(rawValue);

      const numValue = parseInt(rawValue, 10);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(10, Math.max(1, numValue));
        if (clampedValue !== quantity) {
          onQuantityChange(clampedValue);
        }
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue === "" || parseInt(inputValue) < 1) {
      setInputValue("1");
      onQuantityChange(1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="disabled:opacity-50 disabled:cursor-not-allowed p-1"
        aria-label="Decrease quantity"
      >
        <MinusSVGComponent width="0.5em" height="0.5em" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        className="w-5 text-center rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        minLength={1}
        maxLength={2}
        aria-label="Product quantity"
      />

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="disabled:opacity-50 disabled:cursor-not-allowed p-1"
        aria-label="Decrease quantity"
      >
        <PlusSVGComponent width="0.5em" height="0.5em" />
      </button>
    </div>
  );
};

export default QuantityControls;
