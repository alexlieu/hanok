import { MdOutlineQuestionMark } from "react-icons/md";

type InputErrorMessageProps = {
  id: string;
  show: boolean;
  valid?: boolean;
  error: string;
};

const InputErrorMessage: React.FC<InputErrorMessageProps> = ({
  id,
  show,
  valid = false,
  error,
}) => {
  if (show && !valid && error) {
    return (
      <p
        id={id}
        className="flex items-center text-red-500 gap-0.5"
        role="alert"
      >
        <MdOutlineQuestionMark />
        {error}
      </p>
    );
  }
};

export default InputErrorMessage;
