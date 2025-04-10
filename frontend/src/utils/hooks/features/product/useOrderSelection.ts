import { useState, useEffect } from "react";

type Selection = {
  size: string;
  flavour: string;
  quantity: number;
};

const useOrderSelection = (
  getPrice: (size: string, flavour: string) => number | null
) => {
  const [selectedOptions, setSelectedOptions] = useState<Selection>({
    size: "REGULAR",
    flavour: "PLAIN",
    quantity: 1,
  });
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    if (
      selectedOptions.flavour &&
      selectedOptions.size &&
      selectedOptions.quantity
    ) {
      const calculatedPrice = getPrice(
        selectedOptions.size,
        selectedOptions.flavour
      );
      setPrice(
        calculatedPrice !== null
          ? calculatedPrice * selectedOptions.quantity
          : null
      );
    } else {
      setPrice(null);
    }
  }, [selectedOptions, getPrice]);

  const handleOptionSelect =
    (optionTarget: "size" | "flavour" | "quantity") =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const value = event.currentTarget.dataset[optionTarget];
      setSelectedOptions((prevState) => ({
        ...prevState,
        [optionTarget]: value,
      }));
    };

  return {
    price,
    selectedOptions,
    handleOptionSelect,
  };
};

export default useOrderSelection;
