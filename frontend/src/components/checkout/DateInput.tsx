import { UseFormRegister, Path, FieldError } from "react-hook-form";
import { FormData } from "../../schemas/checkoutFormSchema";
import ErrorMessage from "./ErrorMessage";
import {
  formatDateString,
  getFirstValidDate,
  getLastValidDate,
} from "../../validator/PickupDateValidator";

type DateInputProps = {
  name: Path<FormData>;
  register: UseFormRegister<FormData>;
  displayLabel: string;
  error: FieldError | undefined;
};

const DateInput: React.FC<DateInputProps> = ({
  name,
  register,
  displayLabel,
  error,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{displayLabel}</label>
      <ErrorMessage error={error} />
      <input
        type="date"
        id={name}
        {...register(name, {
          setValueAs: (v) => {
            if (!v) return undefined;
            const date = new Date(v);
            date.setUTCHours(0, 0, 0, 0);
            return date.toISOString();
          },
        })}
        min={formatDateString(getFirstValidDate())}
        max={formatDateString(getLastValidDate())}
      />
    </div>
  );
};

export default DateInput;
