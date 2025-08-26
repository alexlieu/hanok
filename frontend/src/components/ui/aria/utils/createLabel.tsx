import { Label } from "../Field";

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
    <Label id={id} htmlFor={htmlFor}>
      <span className={focusStyling}>{firstWord}</span>
      {restOfString && <span>{" " + restOfString}</span>}
      {isRequired && <span className="ml-0.5 text-error-red">*</span>}
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
