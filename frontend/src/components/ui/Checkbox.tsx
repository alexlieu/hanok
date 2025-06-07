type CheckboxProps = {
  name: string;
  value: string;
  handleChange: () => void;
  checked: boolean;
  disabled: boolean;
  label: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  value,
  handleChange,
  checked,
  disabled,
  label,
}) => {
  const localHandleChange = () => {
    handleChange();
  };
  return (
    <div className="flex flex-row gap-2">
      <input
        type="checkbox"
        name={name}
        id={name}
        value={value}
        checked={checked}
        onChange={localHandleChange}
        disabled={disabled}
      />
      <label htmlFor={name} className={disabled ? "text-gray-400" : ""}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
