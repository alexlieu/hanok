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
    <button onClick={handleRemove} aria-label="Remove item">
      Remove
    </button>
  );
};

export default RemoveButton;
