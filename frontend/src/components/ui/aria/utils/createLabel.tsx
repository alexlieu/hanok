import { Label } from "../Field";
import { motion, Variants } from "motion/react";
import { LuAsterisk } from "react-icons/lu";

export interface CreateLabelProps {
  label?: string | undefined;
  id?: string;
  htmlFor?: string;
  isRequired?: boolean | undefined;
  isFocused?: boolean;
  isInvalid?: boolean;
}

// export function createLabel({
//   label,
//   id,
//   htmlFor,
//   isRequired,
//   isFocused,
//   isInvalid,
// }: CreateLabelProps) {
//   if (!label) return null;

//   const brandColour = "var(--color-brand-colour-4)";
//   const errorColour = "var(--color-error-red)";
//   const initialTextColour = "#000000";
//   const animatedTextColour = "#FFFFFF";

//   const highlightColour = isInvalid ? errorColour : brandColour;

//   const words = label.split(" ");
//   const lastWord = words.pop();
//   const mainLabel = words.length > 0 ? words.join(" ") + " " : "";

//   return (
//     <Label id={id} htmlFor={htmlFor}>
//       <motion.span
//         className="inline"
//         style={{
//           backgroundImage: `linear-gradient(to top, ${highlightColour}, ${highlightColour})`,
//           backgroundPosition: "bottom",
//           backgroundSize: "100% 0%",
//           backgroundRepeat: "no-repeat",
//         }}
//         animate={{
//           backgroundSize: isFocused ? "100% 100%" : "100% 0%",
//           color: isFocused ? animatedTextColour : initialTextColour,
//         }}
//         transition={{
//           backgroundSize: { ease: "easeOut", duration: 0.3 },
//           color: { ease: "easeOut", duration: 0.2, delay: 0.05 },
//         }}
//       >
//         {mainLabel}
//         <span className="inline-block">
//           {lastWord}
//           {isRequired && (
//             <LuAsterisk className="inline-block h-[0.8rem] w-[0.8rem] ml-1 align-baseline text-error-red" />
//           )}
//         </span>
//       </motion.span>
//     </Label>
//   );
// }

export function createLabel({
  label,
  id,
  htmlFor,
  isRequired,
  isFocused,
  isInvalid,
}: CreateLabelProps) {
  if (!label) return null;

  const brandColor = "var(--color-brand-colour-4)";
  const errorColor = "var(--color-error-red)";
  const initialTextColor = "#000000";
  const animatedTextColor = "#FFFFFF";
  const highlightColor = isInvalid ? errorColor : brandColor;

  const words = label.split(" ");
  const lastWord = words.pop() || "";
  const mainLabel = words.join(" ");

  const animationVariants: Variants = {
    focused: {
      backgroundSize: "100% 100%",
      color: animatedTextColor,
      transition: {
        backgroundSize: { ease: "easeOut", duration: 0.2 },
        color: { ease: "easeOut", duration: 0.2 },
      },
    },
    blurred: {
      backgroundSize: "100% 0%",
      color: initialTextColor,
      transition: {
        backgroundSize: { ease: "easeOut", duration: 0.2 },
        color: { ease: "easeOut", duration: 0.2 },
      },
    },
  };

  const motionSpanStyle = {
    backgroundImage: `linear-gradient(to top, ${highlightColor}, ${highlightColor})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
  };

  return (
    <Label id={id} htmlFor={htmlFor}>
      {mainLabel && (
        <motion.span
          key={mainLabel}
          className="inline"
          style={motionSpanStyle}
          variants={animationVariants}
          initial="blurred"
          animate={isFocused ? "focused" : "blurred"}
        >
          {mainLabel}
          {lastWord ? " " : ""}
        </motion.span>
      )}

      <span className="inline-block">
        <motion.span
          key={label}
          className="inline"
          style={motionSpanStyle}
          variants={animationVariants}
          initial="blurred"
          animate={isFocused ? "focused" : "blurred"}
        >
          {lastWord}
        </motion.span>

        {isRequired && (
          <LuAsterisk className="inline-block h-[0.8rem] w-[0.8rem] ml-1 align-baseline text-error-red" />
        )}
      </span>
    </Label>
  );
}

export function createNoFocusLabel({
  label,
  isRequired,
  id,
  htmlFor,
  className,
}: Omit<CreateLabelProps, "isFocused"> & { className?: string }) {
  if (label === undefined) return;
  const words = label.split(" ");
  const lastWord = words.pop() || "";
  const mainLabel = words.join(" ");
  return (
    <Label id={id} htmlFor={htmlFor} className={className}>
      {isRequired ? (
        <>
          {mainLabel}
          {lastWord ? " " : ""}
          <span className="inline-block">
            {lastWord}
            {isRequired && (
              <LuAsterisk className="inline-block h-[0.8rem] w-[0.8rem] ml-1 align-baseline text-error-red" />
            )}
          </span>
        </>
      ) : (
        <>label</>
      )}
    </Label>
  );
}
