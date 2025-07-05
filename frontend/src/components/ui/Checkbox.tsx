import { UseFormRegister, Path } from "react-hook-form";
import { FormData } from "../../schemas/checkoutFormSchema";

type CheckboxProps = {
  name: Path<FormData>;
  register: UseFormRegister<FormData>;
  displayLabel: string;
  onChange: () => void;
};

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  register,
  displayLabel,
  onChange,
}) => {
  return (
    <div className="flex flex-row gap-2">
      <input
        className="form-input-base rounded-md"
        type="checkbox"
        id={name}
        {...register(name, { onChange: () => onChange() })}
      />
      <label htmlFor={name} className={""}>
        {displayLabel}
      </label>
    </div>
  );
};

export default Checkbox;
