import { MdOutlineQuestionMark } from "react-icons/md";
import { FieldError } from "react-hook-form";

type ErrorMessageProps = {
  error: FieldError | undefined;
  className?: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className }) => {
  if (!error) return null;
  return (
    <p
      className={
        className ? className : `flex items-center text-red-500 gap-0.5`
      }
      role="alert"
    >
      <MdOutlineQuestionMark />
      {error?.message}
    </p>
  );
};

export default ErrorMessage;
