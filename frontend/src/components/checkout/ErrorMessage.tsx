import { MdOutlineQuestionMark } from "react-icons/md";
import { FieldValues, FieldPath, FieldErrors } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFromPath = (obj: Record<string, any>, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

interface FormErrorProps<T extends FieldValues> {
  name: FieldPath<T>;
  errors: FieldErrors<T>;
}

const FormError = <T extends FieldValues>({
  name,
  errors,
}: FormErrorProps<T>) => {
  const error = getFromPath(errors, name);

  if (!error) {
    return null;
  }

  return (
    <p className="mt-1 text-sm text-red-500 flex items-center" role="alert">
      <MdOutlineQuestionMark />
      {error.message as string}
    </p>
  );
};

export default FormError;
