import { MdOutlineQuestionMark } from "react-icons/md";
import { FieldError } from "react-hook-form";

type ErrorMessageProps = {
  error: FieldError | undefined;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;
  return (
    <p className="flex items-center text-red-500 gap-0.5" role="alert">
      <MdOutlineQuestionMark />
      {error?.message}
    </p>
  );
};

export default ErrorMessage;
