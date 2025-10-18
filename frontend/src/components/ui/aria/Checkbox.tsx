import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { AnimatedFieldError, Description } from "./Field";
import { composeTailwindRenderProps, focusRing } from "./utils";
import { ReactNode } from "react";
import { createLabel } from "./utils/createLabel";
import { LuMinus as Minus } from "react-icons/lu";
import { CheckIcon as Check } from "../icons/Check";
import { RefCallBack } from "react-hook-form";
import { motion, Transition } from "motion/react";
import { ClickBurstIcon } from "../icons/ClickBurst";

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string;
  inputRef?: RefCallBack;
}

export function CheckboxGroup({
  className,
  label,
  isRequired,
  children,
  description,
  errorMessage,
  value,
  onChange,
  onBlur,
  inputRef,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
      {...props}
      className={composeTailwindRenderProps(className, "flex flex-col gap-2")}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      ref={inputRef}
    >
      {createLabel({ label, isRequired })}
      {Array.isArray(children) ? (
        children.length <= 4 ? (
          <span className="flex flex-row gap-5">{children}</span>
        ) : (
          children
        )
      ) : (
        children
      )}
      {description && <Description>{description}</Description>}
      <AnimatedFieldError isInvalid={props.isInvalid} children={errorMessage} />
    </AriaCheckboxGroup>
  );
}

const checkboxStyles = tv({
  base: "flex gap-2 items-center text-sm transition relative",
  variants: {
    isDisabled: {
      false: "text-gray-800",
      true: "text-gray-300",
    },
  },
});

const boxStyles = tv({
  extend: focusRing,
  base: "w-[1.5rem] h-[1.5rem] shrink-0 flex items-center justify-center border-2 border-brand-colour-5 transition",
  variants: {
    isSelected: {
      false: "",
      true: "",
    },
    isInvalid: {
      true: "border-error-red",
    },
    isDisabled: {
      true: "[--color:var(--color-unavailable)]",
    },
  },
});

const iconStyles =
  "w-4 h-4 text-brand-colour-5 group-disabled:text-unavailable-text";

const pressedScale = 0.9;
const scaleTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 17,
};

export function Checkbox(props: CheckboxProps) {
  return (
    <AriaCheckbox
      name={props.name}
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        checkboxStyles({ ...renderProps, className })
      )}
    >
      {({ isSelected, isIndeterminate, isPressed, ...renderProps }) => {
        const playSelectAnimation = !isSelected && isPressed;
        return (
          <>
            <div className="relative" aria-hidden>
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden
              >
                <ClickBurstIcon
                  playAnimation={isSelected}
                  size="3rem"
                  stroke="var(--color-brand-colour-1)"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <motion.div
                variants={{
                  normal: {
                    scale: 1,
                  },
                  pressed: {
                    scale: pressedScale,
                    transition: scaleTransition,
                  },
                }}
                initial="normal"
                animate={playSelectAnimation ? "pressed" : "normal"}
                className={boxStyles({
                  isSelected: isSelected || isIndeterminate,
                  ...renderProps,
                })}
                aria-hidden
              >
                <motion.div
                  variants={{
                    normal: {
                      scale: 1,
                    },
                    pressed: {
                      scale: 1 / pressedScale,
                    },
                  }}
                  initial="normal"
                  animate={playSelectAnimation ? "pressed" : "normal"}
                  transition={scaleTransition}
                  aria-hidden
                >
                  {isIndeterminate ? (
                    <Minus aria-hidden className={iconStyles} />
                  ) : (
                    <Check
                      playAnimation={isSelected}
                      size={"1.25rem"}
                      stroke="var(--color-brand-colour-5)"
                      aria-hidden
                    />
                  )}
                </motion.div>
              </motion.div>
            </div>
            {props.children}
          </>
        );
      }}
    </AriaCheckbox>
  );
}
