import InputErrorMessage from "./InputErrorMessage";

type NameInputProps = {
  fieldName: string;
  value: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  showError: boolean;
  errorMessage: string;
};

const NameInput: React.FC<NameInputProps> = ({
  fieldName,
  value,
  label,
  onChange,
  onBlur,
  showError,
  errorMessage,
}) => {
  return (
    <div>
      <InputErrorMessage
        show={showError}
        error={errorMessage}
        id={`${fieldName}-error`}
      />
      <label htmlFor={fieldName}>{label}</label>
      <input
        type="text"
        id={fieldName}
        name={fieldName}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      ></input>
    </div>
  );
};

export default NameInput;
