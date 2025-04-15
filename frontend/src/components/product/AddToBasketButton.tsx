import { Link } from "react-router-dom";
import { Selection } from "../../utils/hooks/features/product/useOrderSelection";
import { useBasketState } from "../../utils/hooks/store/useBasket";

type AddToBasketButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  selection: Selection;
  product: string;
};

const buttonStyling =
  "inline-block text-center text-2xl font-medium px-4 py-2 border border-black transition-colors hover:text-white hover:bg-black w-fit";

const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({
  onClick,
  selection,
  product,
}) => {
  const state = useBasketState();
  const itemAdded = state.items.find(
    (v) =>
      v.flavour === selection.flavour &&
      v.size === selection.size &&
      v.name === product
  );
  if (itemAdded) {
    return (
      <Link
        to="/basket"
        className={buttonStyling}
        aria-label={`${product} (${selection.flavour}, ${selection.size}) is already in your basket. Go to basket to edit quantity.`}
      >
        in basket
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={buttonStyling}
      onClick={onClick}
      aria-label={`Add ${product} (${selection.flavour}, ${selection.size}) to basket`}
    >
      add to basket
    </button>
  );
};

export default AddToBasketButton;
