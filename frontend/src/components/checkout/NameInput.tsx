import { FieldError, Path, UseFormRegister } from "react-hook-form";
import { FormData } from "../../schemas/checkoutFormSchema";
import ErrorMessage from "./ErrorMessage";

type NameInputProps = {
  name: Path<FormData>;
  displayLabel: string;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  required?: boolean;
};

const NameInput: React.FC<NameInputProps> = ({
  name,
  displayLabel,
  register,
  error,
  required,
}) => {
  return (
    <div className="flex flex-col">
      <ErrorMessage error={error} />
      <label htmlFor={name}>{displayLabel}</label>
      <input
        id={name}
        {...register(name, {
          required: required ? `${displayLabel} is required.` : false,
        })}
        className="form-input-base rounded-md"
      />
    </div>
  );
};

export default NameInput;
