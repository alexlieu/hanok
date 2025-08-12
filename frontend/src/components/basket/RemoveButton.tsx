import { useBasketDispatch } from "../../utils/hooks/store/useBasket";

type RemoveButtonProps = {
  itemId: number;
};

const RemoveButton: React.FC<RemoveButtonProps> = ({ itemId }) => {
  const dispatch = useBasketDispatch();
  const handleRemove = () => {
    dispatch({
      type: "REMOVE_ITEM",
      id: itemId,
    });
  };

  return (
    <button
      onClick={handleRemove}
      className="text-gray-500 text-sm"
      aria-label="Remove item"
    >
      REMOVE
    </button>
  );
};

export default RemoveButton;
