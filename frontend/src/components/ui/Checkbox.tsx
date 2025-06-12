import { UseFormRegister, Path } from "react-hook-form";
import { FormData } from "../../schemas/checkoutFormSchema";

type CheckboxProps = {
  name: Path<FormData>;
  register: UseFormRegister<FormData>;
  displayLabel: string;
  disabled: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  register,
  displayLabel,
  disabled,
}) => {
  return (
    <div className="flex flex-row gap-2">
      <input
        type="checkbox"
        id={name}
        disabled={disabled}
        {...register(name)}
      />
      <label
        htmlFor={name}
        className={disabled ? "text-gray-400" : "text-black"}
      >
        {displayLabel}
      </label>
    </div>
  );
};

export default Checkbox;
