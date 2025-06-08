import { MdOutlineQuestionMark } from "react-icons/md";

type InputErrorMessageProps = {
  id: string;
  show: boolean;
  error: string;
};

const InputErrorMessage: React.FC<InputErrorMessageProps> = ({
  id,
  show,
  error,
}) => {
  if (show && error) {
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
