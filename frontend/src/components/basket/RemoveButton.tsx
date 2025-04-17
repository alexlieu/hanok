type RemoveButtonProps = {
  onRemove: () => void;
};

const RemoveButton: React.FC<RemoveButtonProps> = ({ onRemove }) => {
  return (
    <button onClick={onRemove} aria-label="Remove item">
      Remove
    </button>
  );
};

export default RemoveButton;
