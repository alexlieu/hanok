import { Label } from "../Field";
import { motion } from "motion/react";
import { CSSProperties } from "react";
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
        lineWidth: "0px",
        isInvalid: isInvalid,
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
  fill?: string;
  isInvalid?: boolean;
  lineWidth?: string;
  left?: string;
}

function animateBackgroundFill({
  text,
  animateFill,
  fill = "var(--color-brand-colour-4)",
  isInvalid = false,
  lineWidth = "4px",
  left = "0px",
}: backgroundFillProps) {
  return (
    <span className="inline-block relative w-fit h-fit">
      <motion.span
        style={
          {
            "--bottom": lineWidth,
            "--left": left,
            "--fill": fill,
          } as CSSProperties
        }
        initial={{ height: lineWidth }}
        animate={{
          height: animateFill ? `calc(100% + ${lineWidth})` : lineWidth,
        }}
        transition={{ ease: "easeOut", duration: 0.3 }}
        className={`absolute -left-[var(--left)] -bottom-[var(--bottom)] ${
          isInvalid ? "bg-error-red" : `bg-[var(--fill)]`
        } w-[calc(100%+var(--left)*2)]`}
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
