import { Label } from "../Field";
import { motion } from "motion/react";
import { LuAsterisk } from "react-icons/lu";

export interface CreateLabelProps {
  label?: string | undefined;
  id?: string;
  htmlFor?: string;
  isRequired?: boolean | undefined;
  isFocused?: boolean;
  isInvalid?: boolean;
}

export function createLabel({
  label,
  id,
  htmlFor,
  isRequired,
  isFocused,
  isInvalid,
}: CreateLabelProps) {
  if (!label) return null;
  // const words = label.split(" ");
  // const firstWord = words.shift();
  // const restOfString = words.join(" ");
  return (
    <Label
      id={id}
      htmlFor={htmlFor}
      className="flex flex-row gap-[3px] justify-center items-center"
    >
      {animateBackgroundFill({
        text: label,
        animateFill: isFocused!,
        initialLineWidth: "0px",
        invalidColourFill: isInvalid,
      })}
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

interface backgroundFillProps {
  text: string;
  animateFill: boolean;
  invalidColourFill?: boolean;
  initialLineWidth?: string;
}

function animateBackgroundFill({
  text,
  animateFill,
  invalidColourFill = false,
  initialLineWidth = "4px",
}: backgroundFillProps) {
  return (
    <span className="inline-block relative w-fit h-fit">
      <motion.span
        initial={{ height: initialLineWidth }}
        animate={{
          height: animateFill
            ? `calc(100% + ${initialLineWidth})`
            : initialLineWidth,
        }}
        transition={{ ease: "easeOut" }}
        className={`absolute -left-[2px] -bottom-[${initialLineWidth}] ${
          invalidColourFill ? "bg-error-red" : "bg-brand-colour-4"
        } w-[calc(100%+4px)]`}
      />
      <span className="invisible">{text}</span>
      <span
        className={`absolute left-0 transition-colors duration-250 ${
          animateFill && "text-default-bg"
        }`}
      >
        {text}
      </span>
    </span>
  );
}
