import { Label } from "../Field";
import { LuAsterisk } from "react-icons/lu";

export interface CreateLabelProps {
  label?: string | undefined;
  id?: string;
  htmlFor?: string;
  isRequired?: boolean | undefined;
  isFocused?: boolean;
}

export function createLabel({
  label,
  id,
  htmlFor,
  isRequired,
  isFocused,
}: CreateLabelProps) {
  if (!label) return null;
  const words = label.split(" ");
  const firstWord = words.shift();
  const restOfString = words.join(" ");
  const focusStyling = `${
    isFocused && "overline decoration-3 decoration-brand-colour-3"
  }`;
  return (
    <Label
      id={id}
      htmlFor={htmlFor}
      className="flex flex-row gap-[3px] justify-center items-center"
    >
      <span>
        <span className={focusStyling}>{firstWord}</span>
        {restOfString && " " + restOfString}
      </span>
      {isRequired && (
        <LuAsterisk className="h-[0.8lh] w-[0.8lh] text-error-red" />
      )}
    </Label>
  );
}

export function createNoFocusLabel({
  label,
  isRequired,
}: Omit<CreateLabelProps, "isFocused">) {
  if (label === undefined) return;
  return (
    <Label>
      {label}
      {isRequired && <span className="ml-0.5 text-error-red">*</span>}
    </Label>
  );
}
