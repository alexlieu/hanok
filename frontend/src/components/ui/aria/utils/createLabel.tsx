import { Label } from "../Field";

export interface CreateLabelProps {
  label?: string | undefined;
  isRequired?: boolean | undefined;
  isFocused?: boolean;
}

export function createLabel({
  label,
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
    <Label>
      <span className={focusStyling}>{firstWord}</span>
      {restOfString && <span>{" " + restOfString}</span>}
      {isRequired && <span className="ml-0.5 text-error-red">*</span>}
    </Label>
  );
}
